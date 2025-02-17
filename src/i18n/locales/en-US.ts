export default {
  title: 'Add Email Account',
  subtitle: 'Enter your email address',
  description:
    'Supports IMAP, SMTP, POP3 configuration lookup for Microsoft 365, Outlook.com, Exchange, Google, iCloud, Yahoo, and more',
  inputPlaceholder: 'Enter email address',
  loading: 'Looking up configuration...',
  protocols: {
    imap: 'IMAP Configuration',
    smtp: 'SMTP Configuration',
    pop3: 'POP3 Configuration',
    ews: 'Exchange Web Services (EWS) Configuration',
    eas: 'Exchange ActiveSync (EAS) Configuration',
  },
  fields: {
    host: 'Server',
    port: 'Port',
    secure: 'Secure Connection',
    username: 'Username',
    encryption: 'Connection Type',
    authentication: 'Authentication',
  },
  encryption: {
    ssl: 'SSL/TLS',
    starttls: 'STARTTLS',
    none: 'No Encryption',
  },
  authentication: {
    secure: 'Secure Auth',
    insecure: 'Normal Auth',
  },
  boolean: {
    true: 'Yes',
    false: 'No',
  },
  rawResponse: 'Raw Response Data',
  errors: {
    invalidEmail: 'Invalid email format',
    networkError: 'Network connection failed, please check your connection',
    notFound: 'Email configuration not found',
    tooManyRequests: 'Too many requests, please try again later',
    serverError: 'Server response error',
    parseError: 'Failed to parse server response',
    noProtocols: 'No supported email protocols found',
  },
}
