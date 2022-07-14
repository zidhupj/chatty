// import { notificationService } from '@hope-ui/solid';
import { AxiosError } from 'axios';
import { Link, useNavigate } from 'solid-app-router';
import { Accessor, Component, ComponentProps, createSignal, createEffect } from 'solid-js';
import { FormContainer, Form, Logo, Title, InputContainer, Input, JustLink, DateContainer, DateLabel, DateInfo, Button, ToastContainer } from '../../components'
import { publicRequest } from '../../functions/requestMethods';
import { schema } from '../../functions/validate';
import { FaSolidAtom } from 'solid-icons/fa'
import toast from 'solid-toast';
import { BiSolidRadiation } from 'solid-icons/bi';

interface SignUpPart1Props extends ComponentProps<any> {
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
    setValues: any,
    setContactValue: any,
    contactValue: Accessor<string>,
    toastId: string
}

const SignUpPart1: Component<SignUpPart1Props> = (props: SignUpPart1Props) => {
    const navigate = useNavigate();
    const { handleChange, values, setValues, contactValue, setContactValue, toastId } = props;


    const nextHandler = async () => {
        if (validate()) {
            toast.custom(() =>
                <ToastContainer status="loading">s
                    <FaSolidAtom size="30px" />
                    <div>Trying to send OTP</div>
                </ToastContainer>
                , { id: toastId, duration: 100_000_000 })
            try {
                const { data } = await publicRequest.post('/auth/generate-otp', {
                    contact: values().contact
                })
                setValues({ ...values(), hashedOtp: data.hashedOtp })
                navigate('/signup/part2')
            } catch (error: any) {
                if (error instanceof AxiosError) {
                    console.log(error);
                    toast.custom(() =>
                        <ToastContainer status="danger">
                            <BiSolidRadiation size="30px" />
                            <div>{"An erorr"}</div>
                        </ToastContainer>
                        , { id: toastId, duration: 100_000_000 })
                }
            }
        }
    }

    const validate = () => {
        const { name, contact, dateOfBirth, username } = values();
        if (schema.validate({ name }).error) {
            toast.custom(() =>
                <ToastContainer status="danger">
                    <BiSolidRadiation size="30px" />
                    <div>{"Name should have a minimum of 3 and maximum of 50 characters!"}</div>
                </ToastContainer>
                , { id: toastId, duration: 100_000_000 })
            return false;
        }
        if (schema.validate({ username }).error) {
            toast.custom(() =>
                <ToastContainer status="danger">
                    <BiSolidRadiation size="30px" />
                    <div>{"username should have a minimum of 3 amd maximum of 50 characters and should not start with '+' !"}</div>
                </ToastContainer>
                , { id: toastId, duration: 100_000_000 })
            return false;
        }
        if (contactValue() === 'email') {
            if (schema.validate({ email: contact.email }).error) {
                toast.custom(() =>
                    <ToastContainer status="danger">
                        <BiSolidRadiation size="30px" />
                        <div>{"Email is invalid!"}</div>
                    </ToastContainer>
                    , { id: toastId, duration: 100_000_000 })
                return false;
            }
        } else if (contactValue() === 'phone') {
            if (schema.validate({ phone: contact.phone }).error) {
                toast.custom(() =>
                    <ToastContainer status="danger">
                        <BiSolidRadiation size="30px" />
                        <div>{"Phone number is invalid!"}</div>
                    </ToastContainer>
                    , { id: toastId, duration: 100_000_000 })
                return false;
            }
        }
        if (schema.validate({ dateOfBirth }).error) {
            toast.custom(() =>
                <ToastContainer status="danger">
                    <BiSolidRadiation size="30px" />
                    <div>{"Date of Birth is invalid."}</div>
                </ToastContainer>
                , { id: toastId, duration: 100_000_000 })
            return false;
        }
        return true;
    }

    const changeContact = (c: string) => {
        setContactValue(c);
        setValues({ ...values(), contact: { ...values().contact, [c == "email" ? "phone" : "email"]: '' } })
        console.log(values().contact);
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
                    <Title>CREATE YOUR ACCOUNT</Title>
                    <InputContainer>
                        <Input
                            type="text"
                            placeholder=" "
                            name="name"
                            onChange={handleChange}
                            value={values().name}
                        />
                        <label>Name</label>
                    </InputContainer>
                    <InputContainer>
                        <Input
                            type="text"
                            placeholder=" "
                            name="username"
                            onChange={handleChange}
                            value={values().username}
                        />
                        <label>username</label>
                    </InputContainer>
                    <InputContainer>
                        {contactValue() === 'email' && <>
                            <Input
                                id='email'
                                type="text"
                                placeholder=" "
                                name="email"
                                onChange={handleChange}
                                value={values().contact.email}
                            />
                            <label for="email">Email</label>
                            <JustLink><a onClick={() => changeContact('phone')}>Use phone instead</a></JustLink>
                        </>}
                        {contactValue() === 'phone' && <>
                            <Input
                                id='phone'
                                type="tel"
                                placeholder=" "
                                name="phone"
                                onChange={handleChange}
                                value={values().contact.phone}
                            />
                            <label for="phone">Phone with country code! &nbsp;&nbsp; [Telegram users only!]</label>
                            <JustLink><a onClick={() => changeContact('email')}>Use email instead</a></JustLink>
                        </>}
                    </InputContainer>
                    <DateContainer>
                        <DateLabel>DATE OF BIRTH</DateLabel>
                        <DateInfo>
                            This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.
                        </DateInfo>
                        <Input
                            type="date"
                            name='dateOfBirth'
                            onChange={handleChange}
                            value={values().dateOfBirth.toISOString().split('T')[0]}
                        />
                    </DateContainer>
                </Form>
                <InputContainer>
                    <Button onClick={nextHandler}>NEXT</Button>
                    <JustLink><Link href="/login">Already have an account?</Link></JustLink>
                </InputContainer>
            </FormContainer>
        </>
    )
}

export default SignUpPart1;