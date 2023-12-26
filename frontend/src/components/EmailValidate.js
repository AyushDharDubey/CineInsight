import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";

export default function EmailValidate() {
    const { token } = useParams();
    const { username } = useParams();
    const [errors, setErrors] = useState({});

    useEffect(() => {
        (async () => {
            const request = await axios.post(
                process.env.REACT_APP_BASE_BACKEND + "/auth/activate_account/",
                {
                    username: username,
                    token: token
                },
            );

            if (request.data) {
                setErrors({});
                window.location.hash = "/";
            } else setErrors(request.response.data);
        })();
    }, []);

    return (
        <>
            <div className='error'>
                {Object.entries(errors).map(([key, message]) => (
                    <p className="error-message">{`${key}: ${message}`}</p>
                ))}
            </div>
            <div>Validating...</div>
        </>
    );
};