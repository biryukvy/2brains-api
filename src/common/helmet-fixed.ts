import helmet from 'helmet';

/*
https://docs.nestjs.com/security/helmet
When using helmet, @apollo/server (4.x), and the Apollo Sandbox, 
there may be a problem with CSP on the Apollo Sandbox. 
Below is the solution for the issue:
*/

export const helmetFixed: Function = helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
      scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
      frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
    },
  },
});
