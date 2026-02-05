import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as authorizers from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import { NlbStack } from "./nlb-stack";


interface ApiGatewayStackProps extends StackProps {
    vpc: ec2.IVpc;
    userPool: cognito.UserPool;
    userPoolClient: cognito.UserPoolClient;
    nlbStack: NlbStack
}

export class ApiGatewayStack extends Stack {
    public readonly httpApi: apigwv2.HttpApi;

    constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
        super(scope, id, props);
            // 1. HTTP API
        this.httpApi = new apigwv2.HttpApi(this, "HttpApi", {
            apiName: "main-http-api",
        });


        // 2. VPC Link
        const vpcLink = new apigwv2.VpcLink(this, "VpcLink", {
        vpc: props.vpc,
        subnets: {
            subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        });

        // 3. Integração com ALB (via DNS)
        const nlbIntegration = new integrations.HttpNlbIntegration(
             "NlbIntegration",
            nlbStack.nlb,
            {
                vpcLink,
            }
            );
        
        this.httpApi.addRoutes({
            path: "/health",
            methods: [apigwv2.HttpMethod.GET],
            integration: nlbIntegration,
        });
        // 4. Rota catch-all
        this.httpApi.addRoutes({
            path: "/{proxy+}",
            methods: [apigwv2.HttpMethod.ANY],
            integration: nlbIntegration,
        });


        const jwtAuthorizer = new authorizers.HttpJwtAuthorizer(
            "CognitoJwtAuthorizer",
            `https://cognito-idp.${this.region}.amazonaws.com/${props.userPool.userPoolId}`,
            {
                jwtAudience: [props.userPoolClient.userPoolClientId],
            }
        );
    }
}