/**
 * Every decoder is individually tested inside the source code, this file serves to provide
 * some real world scenario's testing how various parts / decoders work together.
 */
import { d, TypeOf, IDecoder } from "./mod.ts";

const rules = {
  url: {
    name: "Url",
    fn: (value: string) => {
      const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
      return urlRegex.test(value) ? null : `${value} is not a valid url`;
    },
  },
  shortText: {
    name: "ShortText",
    fn: (value: string) =>
      value.length > 0 && value.length <= 255
        ? null
        : "Short text should be between 0 and 255 characters long",
  },
  longText: {
    name: "LongText",
    fn: (value: string) =>
      value.length > 0 && value.length < 10000
        ? null
        : "Long text should be between 0 and 10000 characters long",
  },
  dateString: {
    name: "DateString",
    fn: (value: string) => {
      const isoRegex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;
      return isoRegex.test(value) ? null : "Value is not a valid ISO string";
    },
  },
  zipCode: {
    name: "ZipCode",
    fn: (value: number) =>
      Number.isInteger(value) && value > 0
        ? null
        : `${value} is not a valid ZipCode (positive integer)`,
  },
};

const cd = {
  url: d.string().withRule(rules.url),
  shortText: d.string().withRule(rules.shortText),
  longText: d.string().withRule(rules.longText),
  dateString: d.string().withRule(rules.dateString),
  zipCode: d.number().withRule(rules.zipCode),
  optional: <Type>(decoder: IDecoder<Type>) =>
    d.union([decoder, d.undefined()]),
};

const CreateUserRequest = d.type({
  firstName: cd.optional(cd.shortText),
  lastName: cd.optional(cd.shortText),
  email: cd.shortText,
  role: d.union([
    d.literal("CUSTOMER"),
    d.literal("ADMIN"),
    d.literal("SUPER_ADMIN"),
  ]),
  addresses: d.union([
    d.array(
      d.type({
        street: cd.shortText,
        city: cd.shortText,
        zipCode: cd.zipCode,
      })
    ),
    d.undefined(),
  ]),
});
type CreateUserRequest = TypeOf<typeof CreateUserRequest>;

const userRequest: CreateUserRequest = {
  email: "Best@mail.com",
  firstName: "Berno",
  lastName: "Mjejsmans",
  role: "ADMIN",
  addresses: [
    {
      city: "Mechelen",
      zipCode: 2800,
      street: "",
    },
  ],
};

const Publishable = d.type({
  publishDate: cd.dateString,
  isPlanned: d.boolean(),
  notifyWhenPublished: d.boolean(),
});

const Shareable = d.type({
  type: d.union([
    d.literal("FACEBOOK"),
    d.literal("TWITTER"),
    d.literal("LINKED_IN"),
  ]),
  url: cd.url,
});

const Content = d.type({
  title: cd.shortText,
  summary: cd.optional(cd.shortText),
  content: cd.longText,
});

const CreateContentRequest = d.type({
  type: d.union([
    d.literal("VIDEO"),
    d.literal("RESULT"),
    d.literal("ACTION"),
    d.literal("TIP"),
  ]),
  data: d.intersection([
    Content,
    d.type({
      social: d.array(Shareable),
      publish: Publishable,
    }),
  ]),
});
type CreateContentRequest = TypeOf<typeof CreateContentRequest>;

const contentRequest: CreateContentRequest = {
  type: "ACTION",
  data: {
    content: "Content",
    summary: "Summary",
    title: "Title",
    publish: {
      isPlanned: true,
      publishDate: new Date().toISOString(),
      notifyWhenPublished: false,
    },
    social: [
      {
        type: "FACEBOOK",
        url: "https://www.facebook.com",
      },
    ],
  },
};

const result = CreateContentRequest.decode(contentRequest);