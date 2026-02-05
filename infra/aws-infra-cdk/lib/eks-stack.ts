import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as eks from "aws-cdk-lib/aws-eks";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";

interface EksStackProps extends StackProps {
  vpc: ec2.IVpc;
}

export class EksStack extends Stack {
    public readonly cluster: eks.Cluster;

    constructor(scope: Construct, id: string, props: EksStackProps) {
        super(scope, id, props);

        // Role do Cluster
        const clusterRole = new iam.Role(this, "EksClusterRole", {
          assumedBy: new iam.ServicePrincipal("eks.amazonaws.com"),
          managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName(
              "AmazonEKSClusterPolicy"
            ),
          ],
        });

        // Cluster
        this.cluster = new eks.Cluster(this, "EksCluster", {
          clusterName: "main-eks",
          version: eks.KubernetesVersion.V1_29,
          vpc: props.vpc,
          role: clusterRole,

          vpcSubnets: [
            { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
          ],

          endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
          defaultCapacity: 0,
        } as any);

        this.addNodeGroup();

        // ALB is created dynamically by AWS Load Balancer Controller via Ingress
        const albControllerSa = this.cluster.addServiceAccount(
          "AwsLoadBalancerController",
          {
            name: "aws-load-balancer-controller",
            namespace: "kube-system",
          }
        );

        albControllerSa.role.addManagedPolicy(
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            "AmazonEKSLoadBalancerControllerPolicy"
          )
        );

        this.cluster.addHelmChart("AlbController", {
          chart: "aws-load-balancer-controller",
          repository: "https://aws.github.io/eks-charts",
          namespace: "kube-system",

          values: {
            clusterName: this.cluster.clusterName,
            serviceAccount: {
              create: false,
              name: "aws-load-balancer-controller",
            },
            region: Stack.of(this).region,
            vpcId: this.cluster.vpc.vpcId,
          },
        });
    }

    private addNodeGroup() {
        this.cluster.addNodegroupCapacity("MainNodeGroup", {
        nodegroupName: "main-ng",
        desiredSize: 2,
        minSize: 1,
        maxSize: 4,

        instanceTypes: [new ec2.InstanceType("t3.medium")],

        subnets: {
            subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        });
    }
}