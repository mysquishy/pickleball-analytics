import { Html, Head, Body, Container, Heading, Text, Button } from '@react-email/components';

interface InviteEmailProps {
  organizationName: string;
  inviteUrl: string;
  invitedBy: string;
}

export default function InviteEmail({ organizationName, inviteUrl, invitedBy }: InviteEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ margin: '0 auto', padding: '40px 20px', maxWidth: '600px' }}>
          <Heading style={{ color: '#333', fontSize: '24px' }}>
            You&apos;ve been invited to join {organizationName}
          </Heading>
          <Text style={{ color: '#666', fontSize: '16px', lineHeight: '24px' }}>
            {invitedBy} has invited you to collaborate on {organizationName}.
          </Text>
          <Text style={{ color: '#666', fontSize: '16px', lineHeight: '24px' }}>
            Click the button below to accept the invitation and get started.
          </Text>
          <Button
            href={inviteUrl}
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
            Accept Invitation
          </Button>
          <Text style={{ color: '#999', fontSize: '12px', marginTop: '40px' }}>
            This invitation will expire in 7 days. If you didn&apos;t expect this invitation, you
            can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
