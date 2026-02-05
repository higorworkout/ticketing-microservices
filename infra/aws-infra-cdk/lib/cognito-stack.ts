import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";


export class CognitoStack extends Stack {
    public readonly userPool: cognito.UserPool;
    public readonly userPoolClient: cognito.UserPoolClient;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.userPool = new cognito.UserPool(this, "TicketingUserPool", {
            userPoolName: "ticketing-auth-users",
            selfSignUpEnabled: true,
            signInAliases: {
                email: true,
            },
            autoVerify: {
                email: true,
                phone: false
            },
            standardAttributes: {
                email: {
                    required: true,
                    mutable: true,
                },
            },
            passwordPolicy: {
                minLength: 8,
                requireLowercase: true,
                requireUppercase: true,
                requireDigits: true,
                requireSymbols: false,
            },
            removalPolicy: RemovalPolicy.DESTROY, // dev/study
        });

        this.userPool.addDomain("UserDomain", {
            cognitoDomain: {
                domainPrefix: "ticketing-auth-service"
            }
        });

        this.userPoolClient = new cognito.UserPoolClient(
            this,
            "TicketingUserPoolClient",
            {
                userPool: this.userPool,
                generateSecret: false,
                authFlows: {
                    userPassword: true,
                    userSrp: true,
                },
                oAuth: {
                    flows: {
                        authorizationCodeGrant: true,
                    },
                    scopes: [
                        cognito.OAuthScope.OPENID,
                        cognito.OAuthScope.EMAIL,
                        cognito.OAuthScope.PROFILE,
                    ],
                    callbackUrls: ["http://localhost:3000"],
                    logoutUrls: ["http://localhost:3000"],
                },
            }
        );

  
    }


}