import React from 'react';
import { AWSProvider } from '../provider/AWSProvider';

const AWSViewer = () => {
    const [selectedRegion, setSelectedRegion] = React.useState(-1);
    const [selectedVpc, setSelectedVpc] = React.useState(-1);
    const [awsRegions, setAwsRegions] = React.useState({});
    const [vpcs, setVpcs] = React.useState({});
    const [subnets, setSubnets] = React.useState({});

    const regionClick = (idx) => {
        if (selectedRegion !== idx) {
            setSelectedRegion(idx);
        } else {
            setSelectedRegion(-1);
        }
        setVpcs({});
        setSubnets({});
        setSelectedVpc(-1);
    };

    const vpcClick = (idx) => {
        console.log(">>> SETTING SELECTED VPC TO ", idx);
        setSelectedVpc(idx);
    };

    const displayRegions = () => {
        if (awsRegions.Regions) {
            return <span className="regionsContainer">
                <div className="regionHeading"><b>Available Regions</b></div>
                <ul className="awsRegions">
                    {
                        awsRegions.Regions.map((item, idx) => {
                            const isNotOptedIn = (item.OptInStatus === "not-opted-in");
                            return <li key={idx} title="Click to load VPCs">
                                <span className={`region ${(isNotOptedIn&&"notOptedIn")} ${selectedRegion===idx?"selectedRegion":""}`}
                                      onClick={(e)=>{if(isNotOptedIn)return; regionClick(idx)}}
                                      title={`${isNotOptedIn?"":"Click to load VPC for this region"}`}>
                                    <span className="regionName">{item.RegionName}</span>
                                    {isNotOptedIn && <span className="optInState">{item.OptInStatus}</span>}
                                </span>
                            </li>
                        })
                    }
                </ul>
            </span>
        }
    };

    const displayVpc = () => {
        if (vpcs && vpcs.Vpcs) {
            return <span className="vpcContainer">
                {
                    vpcs.Vpcs.map((item,idx) => {
                        console.log(item);
                        return <div className={`vpcEntry ${selectedVpc === idx ? "selectedVpc" : ""}`}
                                    title="Click to load Subnets for this VPC"
                                    onClick={()=>{vpcClick(idx);}}>
                            <pre>
                                <code>
                                { JSON.stringify(item,
                                    (key,value) => {
                                        if (key === "subnets") {
                                            return undefined;
                                        }
                                        return value;
                                    },
                                    " ")
                                }
                                </code>
                            </pre>
                        </div>
                    })
                }
            </span>
        }
        return <></>;
    };

    const displaySubnets = () => {
        if (subnets && subnets.Subnets) {
            return <span className="subnetContainer">
                {
                    subnets.Subnets.map((item) => {
                        return <div className={`subnetEntry`}>
                            <pre>
                                <code>{ JSON.stringify(item,null," ") }</code>
                            </pre>
                        </div>
                    })
                }
            </span>
        }
        return <></>;
    };


    React.useEffect(()=>{
        (async()=>{
            const regions = await AWSProvider.getAllRegions();
            console.log(">>> REGIONS: ",regions);
            setAwsRegions(regions);
        })();
    },[]);

    React.useEffect(()=>{
        if (selectedRegion !== -1) {
            const region = awsRegions.Regions[selectedRegion];
            if (!region.vpcs) {
                (async()=>{
                    const vpcs = await AWSProvider.getAllVpcs(region.RegionName);
                    console.log(">>> VPCS: ",vpcs);
                    region.vpcs = vpcs;
                    setVpcs(region.vpcs);
                })();
            } else {
                setSubnets({});
                setVpcs(region.vpcs);
            }
        }
    },[selectedRegion]);

    React.useEffect(()=>{
        if (selectedVpc !== -1) {
            console.log(">>> GETTING SUBNETS ", selectedVpc, vpcs);
            const vpc = vpcs.Vpcs[selectedVpc];
            if (!vpc.subnets) {
                (async()=>{
                    const region = awsRegions.Regions[selectedRegion];
                    const subnets = await AWSProvider.getAllSubnets(region.RegionName, vpc.VpcId);
                    console.log(">>> SUBNETS: ",subnets);
                    vpc.subnets = subnets;
                    setSubnets(subnets);
                })();
            } else {
                setSubnets(vpc.subnets);
            }
        }
    },[selectedVpc]);

    return (
        <div>
            {awsRegions.error && <div className='errorMsg'>{awsRegions.error}</div>}
            { displayRegions() }
            { displayVpc() }
            { displaySubnets() }
        </div>
    )
}

export default AWSViewer;