const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

// Configuración para apuntar a la instancia local de SQS
/*
const sqs = new AWS.SQS({
  region: 'sa-east-1', // Puedes usar cualquier región
  endpoint: 'http://localhost:4566' // La URL de LocalStack para SQS
});*/

const sqs = new AWS.SQS({ region: process.env.REGION });
const QUEUE_URL = process.env.PENDING_ORDER_QUEUE;
//const QUEUE_URL = process.env.PENDING_ORDER_QUEUE_URL;

module.exports.hacerPedidoPizza = async (event) => {
  console.log('HacerPedido fue llamada');
  const orderId = uuidv4();
  // Parseamos el cuerpo de la solicitud
  const body = JSON.parse(event.body);

  const params = {
    MessageBody: JSON.stringify({
      orderId: orderId,
      name: body.name,
      address: body.address,
      pizzas: body.pizzas
    }),
    QueueUrl: QUEUE_URL
  };

  try {
    const data = await sqs.sendMessage(params).promise();
    console.log('Mensaje enviado a SQS con éxito', data);

    const message = {
      orderId: orderId,
      messageId: data.MessageId,
      name: body.name,
      address: body.address,
      pizzas: body.pizzas 
    };

    return sendResponse(200, message);
  } catch (err) {
    console.error('Error al enviar mensaje a SQS:', err);
    return sendResponse(500, { error: 'Error al enviar el mensaje a la cola.' });
  }
};

module.exports.prepararPedidoPizza = async (event) => {
  console.log('prepararPedidoPizza fue llamada');
  console.log(event);
}

function sendResponse(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}

/*
module.exports.hacerPedidoPizza = async (event) => {
  console.log("Evento recibido:", JSON.stringify(event, null, 2)); // Imprime el evento completo
  const httpMethod = event.httpMethod; // Detecta el método HTTP (POST, GET, PUT)
  const pathParameters = event.pathParameters || {};  // Obtiene los parámetros de la ruta, si existen
  if (httpMethod === 'POST') {
    try {
      const orderId = uuidv4(); // Usa uuidv4 para generar un UUID
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `El pedido fue registrado con el número de orden: ${orderId}`
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: `Error interno del servidor: ${error.message}`
        }),
      };
    }
  }

  if (httpMethod === 'GET' && pathParameters.id) {
    // Lógica para obtener un pedido (GET /pedido/{id})
    const orderId = pathParameters.id;
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Detalles del pedido con ID: ${orderId}`,
      }),
    };
  }

  if (httpMethod === 'PUT' && pathParameters.id) {
    // Lógica para actualizar un pedido (PUT /pedido/{id})
    const orderId = pathParameters.id;
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `El pedido con ID: ${orderId} fue actualizado`,
      }),
    };
  }

  // Si el método HTTP no está manejado, retorna un error
  return {
    statusCode: 400,
    body: JSON.stringify({
      message: 'Método HTTP no soportado o parámetros incorrectos',
    }),
  };
};*/
