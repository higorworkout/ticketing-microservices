import { useState } from "react";
import useRequest from "../hooks/use-request";
import { useRouter } from "next/router";

export default function Signup() {
    const Router = useRouter();
    const [form, setForm] = useState({
        email: "",
        password: "",});
    const  { doRequest, errors } = useRequest({ 
        url: "/api/users/signup", 
        method: "post", 
        body: form, 
        onSuccess: () => Router.push("/") });
    
    const onsubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        await doRequest();
    };
       
    return (
        <div className="container">
        <h1>Sign Up</h1>
        <form onSubmit={onsubmit}>
            <div className="form-group">
            <label>Email Address</label>
            <input 
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })} 
                className="form-control" />
            </div>
            <div className="form-group">
            <label>Password</label>
            <input 
                value={form.password} 
                type="password" 
                onChange={e => setForm({ ...form, password: e.target.value })} 
                className="form-control" />
            </div>
                {errors}
            <button className="btn btn-primary mt-3">Sign Up</button>
        </form>
        </div>
    );
}
