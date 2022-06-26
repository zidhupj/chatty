import { notificationService } from '@hope-ui/solid';
import { AxiosError } from 'axios';
import { Link, useNavigate } from 'solid-app-router';
import { Accessor, Component, ComponentProps, createSignal, createEffect } from 'solid-js';
import { FormContainer, Form, Logo, Title, InputContainer, Input, JustLink, DateContainer, DateLabel, DateInfo, Button } from '../../components'
import { publicRequest } from '../../functions/requestMethods';
import { schema } from '../../functions/validate';

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
}

const SignUpPart1: Component<SignUpPart1Props> = (props: SignUpPart1Props) => {
    const navigate = useNavigate();
    const { handleChange, values, setValues, contactValue, setContactValue } = props;


    const nextHandler = async () => {
        if (validate()) {
            notificationService.show({
                id: "otp",
                status: "info",
                title: "Trying to send OTP",
                description: "You will receive an OTP on your registered email or phone number",
                loading: true
            })

            try {
                const { data } = await publicRequest.post('/auth/generate-otp', {
                    contact: values().contact
                })
                setValues({ ...values(), hashedOtp: data.hashedOtp })
                navigate('/signup/part2')
            } catch (error: any) {
                if (error instanceof AxiosError) {
                    console.log(error);
                    notificationService.update({
                        id: "otp",
                        status: "danger",
                        title: "Invalid Email or Phone Number",
                        description: error.response?.data?.message || "Invalid Email or Phone Number",
                        duration: 20_000,
                    })
                }
            }
        }
    }

    const validate = () => {
        const { name, contact, dateOfBirth, username } = values();
        let flag = 0;
        const settings = {
            status: "danger" as "success" | "info" | "warning" | "danger" | undefined,
            duration: 3_000
        }
        if (schema.validate({ name }).error) {
            notificationService.show({
                title: "Invalid Name",
                description: "Name should have a minimum of 3 amd maximum of 50 characters!",
                ...settings
            })
            flag++;
        }
        if (schema.validate({ username }).error) {
            notificationService.show({
                title: "Invalid username",
                description: "username should have a minimum of 3 amd maximum of 50 characters and should not start with '+' !",
                ...settings
            })
            flag++;
        }
        if (contactValue() === 'email') {
            if (schema.validate({ email: contact.email }).error) {
                notificationService.show({
                    title: "Invalid Email",
                    description: "Email should be in standard format!",
                    ...settings
                })
                flag++;
            }
        } else if (contactValue() === 'phone') {
            if (schema.validate({ phone: contact.phone }).error) {
                notificationService.show({
                    title: "Invalid Phone Number",
                    description: "Phone number should be in standard format!",
                    ...settings
                })
                flag++;
            }
        }
        if (schema.validate({ dateOfBirth }).error) {
            notificationService.show({
                title: "Invalid Date of Birth",
                description: "Date of Birth should be valid and not exeed today!",
                ...settings
            })
            flag++;
        }
        return flag === 0;
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