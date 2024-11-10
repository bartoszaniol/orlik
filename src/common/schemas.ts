const user = {
  id: { type: 'number' },
  username: { type: 'string' },
  email: { type: 'string' },
  telephone: { type: 'string' },
  firebase_token: { type: 'string' },
};

export const venueSchema = {
  id: { type: 'number' },
  name: { type: 'string' },
  phone: { type: 'string' },
  mail: { type: 'string' },
  logo: { type: 'string' },
  address: { type: 'string' },
  type: { type: 'string' },
  availability: { type: 'string' },
  booking_options: { type: 'string' },
};

export const groupSchema = {
  id: { type: 'number' },
  name: { type: 'string' },
  type: { type: 'string' },
  invite_link: { type: 'string' },
};

export const fullGroupSchema = {
  type: 'object',
  properties: {
    ...groupSchema,
    members: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          ...user,
        },
      },
    },
  },
};

const errorSchemaProperties = {
  message: { type: 'string' },
  error: { type: 'string' },
  statusCode: { type: 'number' },
};

export const errorSchema = {
  type: 'object',
  properties: errorSchemaProperties,
};

export const userSchema = {
  type: 'object',
  properties: {
    ...user,
    groups: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          ...groupSchema,
        },
      },
    },
  },
};
