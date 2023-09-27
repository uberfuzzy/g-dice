import { useContext } from "react"

export const playerLookup = (puuid, pdata) => {
    if (puuid === null) return null;

    if (!pdata?.length) return null;

    const f = pdata.filter((p) => {
        return p.uuid === puuid;
    })

    if (!f || f?.length === 0) return null;

    return f[0];
}