# #BackendDeLaSuerte 2023

## Como arrancar

Puedes lanzar el servidor con el API del Restaurante para zombies con:

```
npm run start
```

Y ver los métodos disponibles en un cliente de swagger en http://localhost:3000/api-docs

También se puende lanzar todos los tests con:

```
npm run test
```

---

> Desafío de programación dividido en tres retos donde los participantes tendrán que trabajar con el backend que les toque en suerte, aunque podrán elegir el lenguaje de programación con el que quieren trabajar.

![backenddelasuerte2023](https://user-images.githubusercontent.com/1122071/223094282-d3db3828-60df-45d8-9723-acb41c4f8ec5.jpeg)

Bienvenid@s a un nuevo reto de programación de la comunidad malandriner.

Propondremos 3 retos en 3 semanas y remataremos con una sesión en directo prime para celebrar una nueva fiesta del código.

## Participantes

👉 [Ver issues](https://github.com/webreactiva-devs/backend-de-la-suerte-2023/issues)

| Nick                        | Backend       | Reto 1 | Reto 2 | Reto 3 | Directo | Total |
| --------------------------- | ------------- | ------ | ------ | ------ | ------- | ----- |
| Karlos                      | Xata          |        |        |        |         |       |
| José Ángel Martínez         | Cloudflare D1 |        |        |        |         |       |
| José Manuel Gómez           | CockroachDB   |        |        |        |         |       |
| Juan Andrés Jiménez         | Planetscale   |        |        |        |         |       |
| Sergi Edo                   | Troleado      |        |        |        |         |       |
| Imanol Valero               | Planetscale   |        |        |        |         |       |
| Yuri                        | SurrealDB     |        |        |        |         |       |
| Alfredo                     | EdgeDB        |        |        |        |         |       |
| David Galisteo              | Pocketbase    |        |        |        |         |       |
| SergioPb                    | Xata          |        |        |        |         |       |
| Andrés Cabrera QuieroMiTaza | FaunaDB       |        |        |        |         |       |
| Borja                       | Troleado      |        |        |        |         |       |
| Cesar Octavio Delgado       | KeyDB         |        |        |        |         |       |
| Ramón Ruiz                  | Pocketbase    |        |        |        |         |       |
| Oliver                      | Cloudflare D1 |        |        |        |         |       |

&nbsp;

---

&nbsp;

## Te contaré una historia

Has abierto una Cocina para Zombies.

Los zombies están hartos de comer cerebros. No han ampliado su dieta desde hace siglos y las redes sociales les han empujado a querer tener una vida más moderna.

Quieren salir por ahí, tener vida social, divertirse sin riesgos.

Y tienen dinero en el bolsillo, siempre que tengan carne en la pierna, claro.

Tu misión va a ser crear un buen sistema para que cuando pidan su menú no se enfaden. Claro, cuando se enfadan ya sabes, te comen el cerebro...

## Mecánica del desafío

Se trata de trabajar con las herramientas que más te gusten y solo una impuesta: el backend.

🔴 No es necesario pagar por los backends. La parte gratuita debería ser suficiente para usarla en el desafío.

🔴 No es olbigatorio crear un frontend. Puede ser una API o cualquier otro sistema que te permita trabajar con el backend que no sea el el mismo backend.

🔴 Puedes utilizar el lenguaje o plataforma que quieras para conectarte a tu backend y crear la aplicación.

### Punto de inicio

Hemos sorteado entre los participantes una lista de backends poco conocidas.

### Retos

Se propondrán 3 retos, uno por semana.

Cada reto se podrá resolver con la tecnología que más te guste salvo la parte del Backend, como ya se ha explicado anteriormente.

En cada reto se ganan unos puntos si es superado.

Los puntos se acumulan en la clasificación y son "boletos" para el sorteo de premios que se celebrará el día de cierre del desafío.

---

&nbsp;

## Cómo participar en cada reto

Al ser esta una prueba donde cada uno puede realizar el ejercicio como quiera lo haremos de la siguiente forma.

1. Haz un fork de este repositorio si quieres
2. Trabaja contra ese repositorio de forma independiente, NO haremos uso del PR para unir las soluciones, las publicaremos como parte de este Readme
3. La solución debe tener el código público para que podamos verla.
4. Con cada reto tendrás que enviar una [Issue](https://github.com/webreactiva-devs/backend-de-la-suerte-2023/issues) indicando la dirección del repositorio con la solución

---

&nbsp;

### #TeamTroleado

Un Zombie ha entrado en la cocina y se ha merendado la terminal. La confundió con un cerebro, menudo trol tolai...

Así que los "troleados" tenéis que resolver el desafío con estas condiciones de emergencia:

- Solo podéis utilizar un fichero de texto plano con extensión .menu
- No podéis utilizar ninguna base de datos ni API externa para el almacenamiento
- No podéis usar ni CSV, JSON, YAML... Ni ningún otro formato conocido
- No podéis usar variables serializadas con las herramientas de vuestro código
- Quizás aparezca alguna condición más ;)

---

&nbsp;

![6409974cce829832393392](https://user-images.githubusercontent.com/1122071/223962884-3ed576cc-cd23-48fd-b543-00c2489bb4cb.gif)

## Reto 1: Hasta los zombies tienen cerebro

Te ha tocado un backend en suerte y tienes que ponerlo a trabajar.

El primer reto es muy sencillo.

Tienes que crear una aplicación que se conecte con tu backend para registrar la comanda.

🔴 SOLO vamos a guardar un dato: la fecha y la hora en la que se ha registrado la comanda.

NADA MÁS. Ni platos ni mesas ni nada, ¡¡no te adelantes!!

Dos requisitos:

- Debe poderse almacenar la fecha de la comanda
- Debe poderse leer la última fecha de la comanda

NADA MÁS.

En el segundo reto haremos más cosas con esto, no te aceleres, que los zombies (al menos los de este mundo) van muuuuy lentos ;)

&nbsp;

### Reparto de puntos

- 20 puntos si entregas el resultado antes del día 16 de Marzo (inclusive)
- 10 puntos si lo entregas después.

Máximo de puntos en este reto: 20.

### ¿Qué pasa si el backend que me ha tocado no funciona?

Habla con Dani ;)

&nbsp;

---

&nbsp;

## Reto 2: Oído cocina

El sistema está listo, ¡pongámoslo a trabajar!

Tu sistema de captura de comandas tiene que ampliarse y guardar comandas en un formato como este:

```
Order {
  table: Number
  createdAt: Date
  dishes: [
    {
      name: String,
      quantity: Number
    }
  ]
}
```

- `Number` es entero
- `Date` en formato ISO-8601 UTC Zero (Ejemplo: 2023-03-15T13:03:42Z)
- `createdAt` es el momento en el que entra la comanda en el sistema
- `dishes` es una colección de platos, con nombre y cantidades

**Requisitos**

- Las comandas se acumulan en forma de cola, la primera que entra es la más prioritaria (FIFO).
- No hay límite de platos en cada comanda.
- Tienes que fijar un límite en el máximo de comandas asumibles por la cocina. Por ejemplo, 5.
- Cuando se llega al límite, no se aceptan más comandas y se envía un mensaje de error.
- Solo puedes procesar las comandas borrándolas todas a la vez (esto cambiará en el Reto 3, pero no sabes cómo, no te adelantes)

**Imprescindible**

- Si entra el plato "ESPECIAL ZOMBIE" inmediatamente pasa a estar el primero en la cola.

**Interfaz**

- En la API, web o app que estés montando tienen que verse las comandas en el orden adecuado

**Requisito memorable**

- Tienes que elaborar un menú con al menos 4 platos especiales para Zombies. Ponle cariño e imaginación ;)

&nbsp;

### Reparto de puntos

- 20 puntos si entregas el resultado antes del día 25 de Marzo (inclusive)
- 10 puntos si lo entregas después.

Máximo de puntos en este reto: 20 (de momento, durante la próxima semana habrá sorpresa)

&nbsp;

---

&nbsp;

## Reto 3: Un zombie entra en la cocina

> Hay una opción a ganar 20 puntos sin tocar una línea de código (consulta el grupo de Telegram para saber cómo)

### Primera parte:

Una cocina donde las comandas no se despachan ni es cocina ni es nada. Por muy zombie que sea.

Así que es el momento de añadir esa feature 🥳

Consideraremos una pila FIFO: First In, First Out

Para el orden las mismas condiciones vistas en el reto 2:

- Ordenamos por fecha gracias al campo `createdAt`
- Si entra un "ESPECIAL ZOMBIE" se cuela siempre la primera

Las comandas desaparecen de esa lista en orden y se les puede añadir un campo nuevo `dispatchedAt` para almacenar el momento en el que desaparecen de la comanda.

Tu misión que crear un comando, ruta o lo que sea para que se produzca ese "despacho" de la comanda 1 por 1 y se almacene el cambio en tu #BackendDeLaSuerte.

### Segunda parte:

Se revelará el 25 de Marzo ;)

&nbsp;

### Reparto de puntos

- 20 puntos si entregas el resultado antes del día del directo
- xxx

Máximo de puntos en este reto: 20, de momento

---

&nbsp;

## Directo (30 de Marzo):

- 20 puntos más si presentas tus soluciones en directo
