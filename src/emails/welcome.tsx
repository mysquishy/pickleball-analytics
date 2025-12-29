import { Html, Head, Body, Container, Heading, Text, Button } from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ margin: '0 auto', padding: '40px 20px', maxWidth: '600px' }}>
          <Heading style={{ color: '#333', fontSize: '24px' }}>
            Welcome to Our SaaS, {name}!
          </Heading>
          <Text style={{ color: '#666', fontSize: '16px', lineHeight: '24px' }}>
            Thanks for signing up. We&apos;re excited to have you on board.
          </Text>
          <Button
            href={process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}
            style={{
              backgroundColor: '#000',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '5px',
              textDecoration: 'none',
              display: 'inline-block',
              marginTop: '20px',
            }}
          >
            Get Started
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
