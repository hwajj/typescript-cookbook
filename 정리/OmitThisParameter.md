

https://www.typescriptlang.org/ko/docs/handbook/utility-types.html#omitthisparametertype

- 
- toHex 함수는 this를 필요로 하는 메서드 스타일 함수입니다.
```typescript
function toHex(this: Number) {
  return this.toString(16);
}

```
숫자를 **16진수 문자열(hexadecimal string)** 로 변환하는 함수입니다.
하지만 일반적인 함수가 아니라, this를 필요로 하는 메서드 스타일의 함수입니다.
즉, toHex를 직접 호출할 수 없고, this를 지정해서 호출해야 합니다.

--------------------------------------------------------
#### Auto Boxing

❓ 이 함수는 왜 this가 필요하지?
보통 JavaScript에서 객체의 메서드는 this를 이용해서 객체의 값을 조작합니다.

예를 들어, Number.prototype.toString(16)은 숫자를 16진수 문자열로 변환합니다:
```typescript
console.log((255).toString(16)); // "ff"

```
- 위와 같이 Number 객체의 메서드로 호출하면 this가 자동으로 255가 됩니다.
- 위 코드는 사실상 아래와 같이 동작됨.

```typescript
const numObj = new Number(255); // 숫자를 Number 객체로 변환(Auto Boxing)
console.log(numObj.toString(16)); // "ff"
```
- 255는 원시 타입(number)이지만, toString(16)을 호출할 때 **JavaScript가 자동으로 Number 객체로 변환** 해 줍니다.
- 즉, 내부적으로 new Number(255)처럼 객체로 변환한 후 toString(16)을 실행하는 것과 같습니다.
- 따라서, 메서드(toString) 내부에서 this는 Number 객체를 가리킵니다.
-----------------------------------

그런데 toHex 함수는 독립적인 함수라서, this를 직접 전달하지 않으면 사용할 수 없습니다.
이 함수의 this가 무엇인지 지정해야 올바르게 실행됩니다.

```typescript

// call, apply로 this를 고정해서 실행
console.log(toHex.call(new Number(255))); // "ff"
console.log(toHex.apply(new Number(255))); // "ff" 

// bind로 this를 고정해서 실행
const boundToHex = toHex.bind(new Number(255));
console.log(boundToHex()); // "ff" //타입을 공부하기 위한 인위적인 함수임

//OmitThisParameter를 사용해서 this 제거
const hexFn: OmitThisParameter<typeof toHex> = toHex.bind(255);
console.log(hexFn()); // "ff"

```

```typescript
type WithoutThis = OmitThisParameter<typeof toHex>;
// 기존 타입: (this: Number) => string
// 변환 후 타입: () => string
```














--------------------------------------------------------
  Q. 그러면 
  ```typescript
    
  function toHex(number) {
    return number.toString(16);
  }
  
  ```
이렇게 하면 되는거아냐?

  네, 이 코드에서 255는 this로 동작합니다.
  하지만 여기에는 **자동 박싱(Auto-Boxing)**이라는 개념이 숨어 있습니다.
  
  
  console.log((255).toString(16)); // "ff"
  이렇게 작성하면, 사실상 아래처럼 동작합니다.

```typescript
  const numObj = new Number(255); // 숫자를 Number 객체로 변환
  console.log(numObj.toString(16)); // "ff"

```
  🔹 중요한 개념: 자동 박싱(Auto-Boxing)
  255는 원시 타입(number)이지만, toString(16)을 호출할 때 JavaScript가 자동으로 Number 객체로 변환해 줍니다.
  즉, 내부적으로 new Number(255)처럼 객체로 변환한 후 toString(16)을 호출하는 것과 같습니다.
  따라서, 메서드(toString) 내부에서 this는 Number 객체를 가리킵니다.


  2️⃣ 그러면 그냥 매개변수 쓰면 되지, 왜 this를 써야 해?
  ✅ 일반적인 함수가 더 직관적이고 좋다!
```javascript
  function toHex(number) {
    return number.toString(16);
  }
  
  console.log(toHex(255)); // "ff"

```
  이 방식이 더 간결하고 사용하기 편리합니다. 대부분의 경우, 이렇게 쓰는 것이 더 좋은 선택입니다.
  
  ❌ 그런데 왜 this를 쓰는 경우가 있을까?

  this를 사용하는 이유는 객체 지향적인 스타일 때문입니다.
  즉, toHex를 특정 객체의 메서드처럼 사용하려는 경우입니다.
  
  예를 들어, 만약 toHex를 메서드처럼 사용하고 싶다면 this를 이용하는 게 유용할 수도 있습니다.
  ```typescript
    const numberUtils = {
      toHex: function (this: Number) {
      return this.toString(16);
      }
    };
    
    console.log(numberUtils.toHex.call(new Number(255))); // "ff"

  ```
  하지만 일반적인 함수에서는 this를 쓰는 것이 불필요하게 복잡합니다.
  
  