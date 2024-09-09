const { v4: uuidv4 } = require('uuid');

exports.hacerPedidoPizza = async (event) => {
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
};
