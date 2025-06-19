import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
const API = process.env.REACT_APP_API_URL;

const Login = () => {
    const [user, setUser] = useState("guest");
    const [password, setPassword] = useState("guest123");
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role) {
            alert("You are already logged in.");
            navigate("/author-home", { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user, password }),
            })

            const data = await res.json();

            if (res.status === 429) {
                // rate-limit
                alert(data.error);
                return;
            }
            if (res.status === 401) {
                // invalid credentials
                alert("Username or password is incorrect");
                return;
            }
            if (!res.ok) {
                // other server error
                alert(data.error || "Something went wrong. Please try again.");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            navigate("/author-home", { replace: true });

        } catch (err) {
            console.log("Error message:", err.message);
            alert("Network error. Server may be down.");
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="max-w-screen-lg w-full mx-auto px-4 pt-8 mb-6">
                <h1 className="text-3xl font-bold text-textMain-light dark:text-textMain-dark">
                    Login
                </h1>
            </div>

            <div className="flex-1 flex items-start justify-center pt-4 px-4 sm:pt-10 md:pt-16">
                <div className="max-w-lg w-full mx-2 px-4 py-3 sm:py-8 bg-background-light dark:bg-background-dark shadow dark:shadow-white/30 rounded-lg">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-4">
                            <label className="my-auto">
                                User:
                            </label>
                            <input
                                type="text"
                                placeholder="User Name"
                                defaultValue={"guest"}
                                required
                                maxLength={20}
                                onChange={(e) => setUser(e.target.value)}
                                className="w-full sm:w-[80%] px-3 py-2 border rounded text-textMain-light bg-background-light dark:text-textMain-dark dark:bg-background-dark"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-4">
                            <label className="my-auto">
                                Password:
                            </label>
                            <input
                                type="password"
                                placeholder="Insert Password"
                                defaultValue={"guest123"}
                                required
                                maxLength={20}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full sm:w-[80%] px-3 py-2 border rounded text-textMain-light bg-background-light dark:text-textMain-dark dark:bg-background-dark"
                            />
                        </div>
                        <button type="submit" className="mx-auto click-allowed">
                            Log In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )

};

export default Login;