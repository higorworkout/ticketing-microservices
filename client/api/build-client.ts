import axios from "axios";
import { GetServerSidePropsContext } from "next";

const build_client = ({ req }: GetServerSidePropsContext) => {
    return axios.create({
        baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
        headers: req.headers,
    });
    
};

export default build_client;