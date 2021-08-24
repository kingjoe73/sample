import AWS from 'aws-sdk';

const credentials:AWS.SharedIniFileCredentials = new AWS.SharedIniFileCredentials();
AWS.config.update({
    credentials: credentials,
    region:"eu-west-1"
    // region:"eu-central-1"
});

/* Initialize AWS credentials  */
/*
const credentials:AWS.SharedIniFileCredentials = new AWS.SharedIniFileCredentials();
AWS.config.update({
  credentials: credentials,
  region:"eu-west-1"
  // region:"eu-central-1"
});

const ec2 = new AWS.EC2();
*/

/*
ec2.describeVpcs((err,data) => {
    if (err) {
        console.log("VPC ERROR: ", err);
    } else {
        console.log(data);
    }
});


var params = {
    Filters: [
        {
            Name: "vpc-id",
            Values: [
                "vpc-62b6db08"
            ]
        }
    ]
};
ec2.describeSubnets(params, function(err, data) {
    if (err) {
        console.log("SUBNET ERROR: ", err);
    } else {
        console.log(data);
    }
});
*/

const getAllRegions = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        const ec2 = new AWS.EC2();
        ec2.describeRegions({AllRegions: true}, (err:any, data:any) => {
            if (err) {
                console.log("REGION ERROR: ", err);
                return reject(new Error(err));
            }
            return resolve(data);
        });
    });
}

const getVpcs = (region:string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const ec2 = new AWS.EC2({region:region});
        try {
            ec2.describeVpcs((err,data) => {
                if (err) {
                    console.log("VPC ERROR: ", err);
                    return reject(err);
                }

                console.log(">>> VPC ", data)
                return resolve({region:region, ...data});
            });

        } catch (e) {
            return reject(e.message);
        }
    })
}

const getSubnets = (region:string, vpcId:string[]): Promise<any> => {
    return new Promise((resolve, reject) => {
        const params = {
            Filters: [
                {
                    Name: "vpc-id",
                    Values: vpcId
                }
            ]
        };
        
        try {
            const ec2 = new AWS.EC2({region:region});
            ec2.describeSubnets(params, (err,data) => {
                if (err) {
                    console.log("SUBNETS ERROR ", err);
                    return reject(err);
                }

                console.log(">>> SUBNETS ", data)
                return resolve({region:region,vpcId:vpcId, ...data});
            });

        } catch (e) {
            return reject(e.message);
        }
    })
}

export const EC2Services =  {
    getAllRegions,
    getVpcs,
    getSubnets
}