import './VotingList.css';
import { GetMetadataResponseDto } from "@server/metadata/dto";
import { useContext, useEffect, useState } from "react";
import { ProtocolContext } from "../../../context/Protocol";

function VotingList() {
    const [metadataArray, setMetadataArray] = useState<GetMetadataResponseDto[]>([]);
    const protocol = useContext(ProtocolContext);
    useEffect(() => {
        protocol.fetch?.('metadata').then(async (resp) => {
            if (!resp.ok) return;

            const data = await resp.json() as GetMetadataResponseDto[];
            setMetadataArray(data);
        });
    }, []);

    const content = metadataArray.map((metadata, i) => {
        return <div className="voting-item" key={i}>
            {metadata.name}
            <p/>
            {metadata.description}
            <p/>
            <img src={metadata.image}/>
        </div>;
    });

    return <>
        {content}
    </>
}

export default VotingList;