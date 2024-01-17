import axios from "axios";
import { getAccessToken } from "@privy-io/react-auth";
import { cookies } from "next/headers";

const getAccount = async (fid: number, authToken: string) => {
    const result = await axios.get(
        `${process.env.BASE_URL}/api/account?fid=${fid}`,
        {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        }
    );
    return result.data;
};

async function AccountPage({ params: { fid } }: { params: { fid: string } }) {
    const c = cookies();
    const authToken = c.get("privy-token")?.value;
    if (!authToken) throw new Error("No auth token");

    const account = await getAccount(parseInt(fid), authToken);

    return <div>{fid}</div>;
}

export default AccountPage;
