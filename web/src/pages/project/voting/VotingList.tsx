import { GetMetadataResponseDto } from "@server/metadata/dto";
import { useContext, useEffect, useState } from "react";
import { ProtocolContext } from "../../../context/Protocol";

function VotingList() {
    const [metadataArray, setMetadataArray] = useState<GetMetadataResponseDto[]>([]);
    const protocol = useContext(ProtocolContext);
    useEffect(() => {
        protocol.authFetch?.(
            'metadata'
        ).then(async (resp) => {
            if (!resp.ok) return;

            const data = await resp.json() as GetMetadataResponseDto[];
            setMetadataArray(data);
        });
    }, []);

    const content = metadataArray.map((metadata, i) => {
        return <div key={i}>
            {metadata.title}
        </div>;
    });

    return <>
        {content}
    </>
}

export default VotingList;