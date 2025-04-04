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

interface Props {
  magicLink?: string;
}

export function MagicLinkEmail({ magicLink }: Props) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Clique aqui para entrar no Cogskins.</Preview>
        <Container style={container}>
          <Img
            src="https://i5aee2oj19.ufs.sh/f/VNtBLK6CzQXGhNZUCcz5KQgi9dq3I24POUnMmVDfWBvclz6k"
            width={48}
            height="auto"
            alt="Cogskins"
          />
          <Heading style={heading}>🪄 Seu magic link</Heading>
          <Section style={body}>
            <Text style={paragraph}>
              <Link style={link} href={magicLink}>
                👉 Clique aqui para entrar no Cogskins 👈
              </Link>
            </Text>
            <Text style={paragraph}>
              Se você não solicitou isso, ignore este email.
            </Text>
          </Section>
          <Text style={paragraph}>
            Best,
            <br />- Cogskins Team
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
          <Text style={footer}>Cogskins</Text>
          <Text style={footer}>Endereço para passar credibilidade</Text>
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

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  marginLeft: "4px",
};
