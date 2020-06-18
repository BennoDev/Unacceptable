# Unacceptable

Unacceptable is a Deno-first library for validation and validating unknown data that takes advantage of Typescript's flexible type system, to allow static type generation from validators.

Strongly influenced by existing libraries such as io-ts, runtypes and joi.

## Basic Usage

Validators can be used as such:

```ts
import { d, Infer, isSuccess } from "unacceptable";

const ageValidator = v.string().withRule({
  name: "IsAge",
  fn: (value) =>
    Number.isInteger(value) && value > 0 && value < 120
      ? null
      : "Given number is not a proper age",
});

const UserProfile = v.type({
  email: v.string(),
  firstName: v.string(),
  lastName: v.string(),
  age: ageValidator,
});
type UserProfile = Infer<typeof UserProfile>;

const result = UserProfile.validate({
  email: "Ghenghis_Roundstone@something.com",
  firstName: "Ghenghis",
  lastName: "Roundstone",
  age: 100,
});

if (isSuccess(result)) {
  // Value is of type UserProfile
  console.log("Valid profile: ", result.value);
} else {
  console.error("Invalid data: ", result.errors);
}
```

For examples of specific validators, check their respective documentation pages, or browse the tests.

## Documentation

Roughly speaking we can separate the validators into 3 types:

- Primitive validators (`string, number, boolean, literal, undefined, null`)
- Non-primitive validators (`object, array, type, record`)
- And those that fall outside (`any, unknown, union, intersection`)

Each validator has a dedicated page in the documentation with examples and deeper explanations.

### Validators

Available validators:

- [any](docs/any.md)
- [array](docs/array.md)
- [boolean](docs/boolean.md)
- [intersection](docs/intersection.md)
- [literal](docs/literal.md)
- [null](docs/null.md)
- [number](docs/number.md)
- [object](docs/object.md)
- [partial](docs/partial.md)
- [record](docs/record.md)
- [string](docs/string.md)
- [tuple](docs/tuple.md)
- [type](docs/type.md)
- [undefined](docs/undefined.md)
- [union](docs/union.md)
- [unknown](docs/unknown.md)

### Validation rules

Certain validators, namely `string`, `number`, `array` and `record`, can have custom validation rules, added on top of the base validation. Validation should not mutate or change the data that is being validated, but merely assert conditions.

The return type for a rule is `string | null` where string refers to the error message.

```ts
const validator = string().withRule({
  name: "Password",
  fn: () => {
    const trimmedValue = value.trim();
    const isCorrectLength =
      trimmedValue.length >= 8 && trimmedValue.length < 255;
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z]).{8,}$/;
    return isCorrectLength && passwordRegex.test(value);
  },
});

// Result is type Failure
const result = validator.validate("notgoodenough");
```

### Create a custom validator

Creating your own validator is easy, just create a class that extends either `Validator<T>` or `ValidatorWithRules<T>` (if you want a validator that can have additional rules).
You then need to implement the abstract method `validate(value: unknown) => ValidationResult<Type>` where Type is the return type/the type that will be inferred, and also
the type that is given to the ValidatorWithRules generic class.

Example: simple validator

```ts
import { success, failure, Validator } from "unacceptable";

class DateValidator implements Validator<Date> {
  validate(value: unknown): ValidationResult<Date> {
    if (typeof value === "string" && !Number.isNaN(Date.parse(value))) {
      return success(new Date(value));
    }

    return failure([
      {
        name: "date",
        message: "The given value is not a valid iso string",
        value,
      },
    ]);
  }
}

const validator = new DateValidator();
const result = validator.validate(new Date().toISOString());
// result is Success<Date>
```

Or as a validator that can have custom rules:

```ts
class DateValidator implements ValidatorWithRules<Date> {
  validate(value: unknown): ValidationResult<Date> {
    const timestamp = Date.parse(value);
    if (typeof value !== "string" || Number.isNaN(timestamp)) {
      return failure([
        {
          name: "date",
          message: "The given value is not a valid iso string",
          value,
        },
      ]);
    }

    const errors = this.validateRules(new Date(timestamp));
    return errors.length > 0 ? failure(errors) : success(value);
  }
}

const date = new DateValidator().withRule({
  name: "After2000",
  fn: (value: string) => {
    // We already know it's a valid date
    const date = new Date(value);
    return Date.getYear(date) > 2000
      ? null
      : "Given date is from before the year 2000";
  },
});
const result = validator.validate(new Date().toISOString());
// result is Success<Date>
```

For more information you can look at the individual validator's documentation pages. Or dive into the source code / tests for concrete examples.
