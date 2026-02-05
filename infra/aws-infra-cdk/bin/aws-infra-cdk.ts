import * as cdk from 'aws-cdk-lib/core';
import { NetworkStack } from '../lib/network-stack';
import { EksStack } from '../lib/eks-stack';
import { ApiGatewayStack } from '../lib/api-gateway-stack';
import { CognitoStack } from '../lib/cognito-stack';

const app = new cdk.App();

const environment = app.node.tryGetContext("env") || "dev";

const env: cdk.Environment = {
    account: "537124975999",
    region: "us-east-1"
} 

const tags = {
    Project: "MicroserviceTicketing",
    Environment: environment,
    Owner: "HigorSoares",
    ManagedBy: "AWS-CDK",
    CostCenter: "Ticketing",
    Repository: "github.com/higor/microservice-ticketing",
    team: "HigorCode"
}

const network = new NetworkStack(app, "NetworkStack", {
    tags: tags,
    env: env
});

const eks = new EksStack(app, "EksStack", {
  vpc: network.vpc,
  tags: tags,
  env: env
});

new CognitoStack(app, "CognitoStack", {
  tags: tags,
  env: env
});

new ApiGatewayStack(app, "ApiGatewayStack", {
  vpc: network.vpc,
  tags: tags,
  env: env
});