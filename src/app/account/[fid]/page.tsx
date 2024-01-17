import axios from "axios";
import ServerDataApi from "@/database/ServerDataApi";

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
    const serverDataApi = ServerDataApi();
    const userAccount = await serverDataApi.getUserAccount(parseInt(fid));
    console.log(userAccount);

    return <div>{fid}</div>;
}

export default AccountPage;
