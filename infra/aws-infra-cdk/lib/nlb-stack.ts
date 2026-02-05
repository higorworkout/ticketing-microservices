import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";

interface NlbStackProps extends StackProps {
  vpc: ec2.IVpc;
}

export class NlbStack extends Stack {
  public readonly nlb: elbv2.NetworkLoadBalancer;

  constructor(scope: Construct, id: string, props: NlbStackProps) {
    super(scope, id, props);

    this.nlb = new elbv2.NetworkLoadBalancer(this, "EksNlb", {
      vpc: props.vpc,
      internetFacing: false,
      loadBalancerName: "eks-nlb-internal",
    });
  }
}