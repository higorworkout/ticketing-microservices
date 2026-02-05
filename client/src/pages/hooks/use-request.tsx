import axios from "axios";
import { JSX, useState } from "react";

type Method = "get" | "post" | "put" | "delete";
type Body = { [key: string]: string };


export type Header = {
    method: Method;
    url: string;
    body?: Body;
    onSuccess?: (data: any) => void;
}

const useRequest = ({ url, method, body, onSuccess }: Header) => {
    const [errors, setErrors] = useState<JSX.Element | null>(null);
    
    const doRequest = async () => {
        try {
            setErrors(null);
            const response = await axios[method](url, body);

            if (onSuccess) {
                onSuccess(response.data);
            }   

            return response.data;
        } catch (error) {
            console.log(error);
                setErrors(
                    <div className="alert alert-danger mt-3 mb-0">
                        <h4 className="alert-heading">Oops...</h4>
                        <ul className="mb-0">
                            {axios.isAxiosError(error) && error.response && (error.response.data.errors as { message: string }[]).map((error: { message: string }) => (
                                <li key={error.message}>{error.message}</li>
                            ))}
                        </ul>
                    </div>
                );

        }
    };
   
    return { doRequest, errors }
};

export default useRequest;