const getAllRegions = async () => {
    try {
        const response = await fetch('/api/aws/regions');
        const json = await response.json();
        return json;
    }catch(e){
        return {error:e.message};
    }
}

const getAllVpcs = async (region) => {
    try {
        const response = await fetch(`/api/aws/vpc?region=${region}`);
        const json = await response.json();
        return json;
    }catch(e){
        return {error:e.message};
    }
}

const getAllSubnets = async (region, vpcId) => {
    try {
        const response = await fetch(`/api/aws/subnets?region=${region}&vpcId=${vpcId}`);
        const json = await response.json();
        return json;
    }catch(e){
        return {error:e.message};
    }
}

export const AWSProvider = {
    getAllRegions,
    getAllVpcs,
    getAllSubnets
}