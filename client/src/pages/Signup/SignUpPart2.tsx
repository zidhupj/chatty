import { notificationService } from '@hope-ui/solid';
import { AxiosError } from 'axios';
import { Link, useNavigate } from 'solid-app-router';
import { Accessor, Component, ComponentProps, createEffect, createSignal } from 'solid-js';
import { FormContainer, Form, Logo, Title, InputContainer, Input, JustLink, DateContainer, DateLabel, DateInfo, Button } from '../../components'
import { publicRequest } from '../../functions/requestMethods';
import { schema } from '../../functions/validate';
import { store, setStore } from '../../store/store';

interface SignUpPart2Props extends ComponentProps<any> {
    handleChange: (e: any) => void;
    values: Accessor<{
        username: string;
        contact: {
            email: string;
            phone: string;
        };
        dateOfBirth: Date;
        name: string;
        otp: string;
        hashedOtp: string;
        avatar: string;
    }>;
}

const SignUpPart2: Component<SignUpPart2Props> = (props: SignUpPart2Props) => {
    const { handleChange, values } = props;
    const navigate = useNavigate();
    createEffect(() => {
        console.log(store.user.name);
    });

    const nextHandler = async () => {

        if (validate()) {
            notificationService.show({
                id: "otp",
                status: "info",
                title: "Verifying OTP",
                loading: true
            })

            try {
                const { data } = await publicRequest.post('/auth/signup', values())
                setStore("user", () => data.user)
                store.user?.username && localStorage.setItem('user', JSON.stringify(store.user));
                console.log(store.user.email)
                navigate('/chat')
            } catch (error: any) {
                if (error instanceof AxiosError) {
                    console.log(error);
                    notificationService.update({
                        id: "otp",
                        status: "danger",
                        title: "Invalid Creditentials",
                        description: error.response?.data?.message || "Invalid Creditentials",
                        duration: 5_000,
                    })
                    navigate('/signup/')
                }
            }
        }
    }

    const validate = () => {
        const { otp } = values();
        if (schema.validate({ otp }).error) {
            notificationService.update({
                id: "otp",
                status: "danger",
                title: "Invalid OTP",
                description: "The OTP has to be 6 digits long and should be a number!",
            })
            return false;
        }
        return true;
    }

    return (
        <>
            <FormContainer>
                <Form onSubmit={(e) => { e.preventDefault() }}>
                    <Logo >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                        </svg>
                    </Logo>
                    <Title>ENTER OTP</Title>
                    <InputContainer>
                        <Input
                            type="text"
                            placeholder=" "
                            name="otp"
                            onChange={handleChange}
                        />
                        <label>OTP</label>
                        <JustLink><a>Resend OTP</a></JustLink>
                    </InputContainer>
                </Form>
                <InputContainer>
                    <Button onClick={nextHandler}>NEXT</Button>
                    <JustLink><Link href="/login">Already have an account?</Link></JustLink>
                </InputContainer>
            </FormContainer>
        </>
    )
}

export default SignUpPart2;