/**
 * Every decoder is individually tested inside the source code, this file serves to provide
 * some real world scenario's testing how various parts / decoders work together.
 */
import { assertEquals } from "./test-deps.ts";
import { d, Infer, IDecoder } from "./mod.ts";

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

//#region CreateUserRequest
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
type CreateUserRequest = Infer<typeof CreateUserRequest>;

Deno.test({
  name: "CreateUserRequest: success",
  fn: () => {
    const requests = [
      {
        firstName: "Ronald",
        lastName: "McDonald",
        email: "ronald_mcdonald@mail.com",
        role: "ADMIN",
        addresses: [
          {
            city: "Someplace",
            street: "Best street one",
            zipCode: 2000,
          },
        ],
      },
      {
        firstName: "Ronald",
        lastName: "McDonald",
        email: "ronald_mcdonald@mail.com",
        role: "ADMIN",
        addresses: undefined,
      },
    ];

    requests.forEach((request) => {
      // Using any so I don't have to use the type guards in this test
      const result: any = CreateUserRequest.decode(request);
      assertEquals(result.success, true);
      assertEquals(result.value, request);
    });
  },
});

Deno.test({
  name: "CreateUserRequest: failure",
  fn: () => {
    const requests = [
      {
        firstName: "Ronald",
        lastName: "McDonald",
        email: "ronald_mcdonald@mail.com",
        role: "SOME_DUDE",
        addresses: [
          {
            city: "Someplace",
            street: "Best street one",
            zipCode: 2000,
          },
        ],
      },
      {
        firstName: "Ronald",
        lastName: "McDonald",
        email: "ronald_mcdonald@mail.com",
        role: "ADMIN",
        addresses: [
          {
            city: "Someplace",
            street: "Best street one",
          },
        ],
      },
    ];

    requests.forEach((request) => {
      // Using any so I don't have to use the type guards in this test
      const result: any = CreateUserRequest.decode(request);
      assertEquals(result.success, false);
      assertEquals(Array.isArray(result.errors), true);
    });
  },
});

//#endregion

//#region CreateContentRequest
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
type CreateContentRequest = Infer<typeof CreateContentRequest>;

Deno.test({
  name: "CreateContentRequest: success",
  fn: () => {
    const requests = [
      {
        type: "ACTION",
        data: {
          title: "Action title!",
          summary: "We're gonna do something",
          content: "Fight the power boys and girls",
          publish: {
            isPlanned: true,
            publishDate: new Date().toISOString(),
            notifyWhenPublished: true,
          },
          social: [
            {
              type: "FACEBOOK",
              url: "https://www.facebook.com/sharelink",
            },
          ],
        },
      },
      {
        type: "VIDEO",
        data: {
          title: "Video title!",
          summary: "We're gonna play something",
          content: "Fight the power boys and girls",
          publish: {
            isPlanned: true,
            publishDate: new Date().toISOString(),
            notifyWhenPublished: true,
          },
          social: [
            {
              type: "FACEBOOK",
              url: "https://www.facebook.com/sharelink",
            },
            {
              type: "LINKED_IN",
              url: "https://www.linkedin.com/sharelink",
            },
            {
              type: "TWITTER",
              url: "https://www.twitter.com/sharelink",
            },
          ],
        },
      },
    ];

    requests.forEach((request) => {
      // Using any so I don't have to use the type guards in this test
      const result: any = CreateContentRequest.decode(request);
      assertEquals(result.success, true);
      assertEquals(result.value, request);
    });
  },
});

Deno.test({
  name: "CreateContentRequest: failure",
  fn: () => {
    const requests = [
      {
        type: "ACTION",
        data: {
          title: "Action title!",
          summary: "We're gonna do something",
          content: "Fight the power boys and girls",
          publish: {
            isPlanned: true,
            publishDate: "05-25-2020T20:16:21.965Z",
            notifyWhenPublished: true,
          },
          social: [
            {
              type: "FACEBOOK",
              url: "https://www.facebook.com/sharelink",
            },
          ],
        },
      },
      {
        type: "VIDEO",
        data: {
          title: "Video title!",
          summary: "We're gonna play something",
          content: "Fight the power boys and girls",
          publish: {
            isPlanned: true,
            publishDate: new Date().toISOString(),
            notifyWhenPublished: true,
          },
        },
      },
    ];

    requests.forEach((request) => {
      // Using any so I don't have to use the type guards in this test
      const result: any = CreateContentRequest.decode(request);
      assertEquals(result.success, false);
      assertEquals(Array.isArray(result.errors), true);
    });
  },
});
//#endregion

//#region Errors
Deno.test({
  name: "Errors: should correctly return list of errors",
  fn: () => {
    const result: any = CreateContentRequest.decode({ type: "TIP", data: {} });
    assertEquals(result.errors, [
      {
        message: "Given value is not a string",
        name: "string",
        value: undefined,
        path: ["data", "title"],
      },
      {
        message: "Given value is not a string",
        name: "string",
        value: undefined,
        path: ["data", "content"],
      },
      {
        message: "Value is not an array",
        value: undefined,
        path: ["data", "social"],
      },
      {
        message: "Given value is not an object",
        name: "object",
        value: undefined,
        path: ["data", "publish"],
      },
    ]);
  },
});
//#endregion
