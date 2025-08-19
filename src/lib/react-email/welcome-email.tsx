import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  name?: string;
  loginUrl: string;
}

export function WelcomeEmail({ name, loginUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Welcome to CogSkins! Your subscription is active.</Preview>
        <Container style={container}>
          <Img
            src="https://i5aee2oj19.ufs.sh/f/VNtBLK6CzQXGhNZUCcz5KQgi9dq3I24POUnMmVDfWBvclz6k"
            width={48}
            height="auto"
            alt="Cogskins"
          />
          <Section style={body}>
            <Heading style={heading}>Welcome to CogSkins! 🎉</Heading>
            <Text style={paragraph}>Hi {name || "there"},</Text>
            <Text style={paragraph}>
              Thank you for subscribing! Your payment has been processed
              successfully and your account is now active.
            </Text>
            <Text style={paragraph}>
              To access your account and start using CogSkins, please sign in:
            </Text>
            <Text style={paragraph}>
              <Link style={link} href={loginUrl}>
                👉 Click here to sign in to your account 👈
              </Link>
            </Text>
            <Text style={paragraph}>
              If you have any questions, feel free to reach out to our support
              team.
            </Text>
          </Section>
          <Text style={paragraph}>
            Best regards,
            <br />- The CogSkins Team
          </Text>
          <Hr style={hr} />
          <Img
            src="https://i5aee2oj19.ufs.sh/f/VNtBLK6CzQXGhNZUCcz5KQgi9dq3I24POUnMmVDfWBvclz6k"
            width={32}
            height="auto"
            style={{
              WebkitFilter: "grayscale(100%)",
              filter: "grayscale(100%)",
              margin: "20px 0",
            }}
            alt="Cogskins"
          />
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 25px 48px",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "48px",
};

const body = {
  margin: "24px 0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const link = {
  color: "#b163ff",
};

const hr = {
  borderColor: "#dddddd",
  marginTop: "48px",
};
