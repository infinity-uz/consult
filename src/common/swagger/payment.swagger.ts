import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { paymentData } from '../document/paymentData';

export function SwaggerRelatedToCreate() {
  return applyDecorators(
    ApiOperation({ summary: 'Create Payment' }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Payment successfully created',
      schema: {
        example: {
          statusCode: 201,
          message: 'Payment created successfully',
          data: paymentData,
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Validation error (invalid data)',
      schema: {
        example: {
          statusCode: 400,
          message: 'Invalid bookDate format',
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Payment already exists',
      schema: {
        example: {
          statusCode: 409,
          message: 'Payment for this patient and time already exists',
          error: 'Conflict',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Unexpected server error',
      schema: {
        example: { statusCode: 500, message: 'Internal server error' },
      },
    }),
  );
}

export function SwaggerRelatedToFindAll() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all Payments' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'List of all payments',
      schema: {
        example: {
          statusCode: 200,
          message: 'Payments fetched successfully',
          data: [paymentData],
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'No payments found',
      schema: {
        example: {
          statusCode: 404,
          message: 'No payments available',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Unexpected server error',
      schema: {
        example: { statusCode: 500, message: 'Internal server error' },
      },
    }),
  );
}

export function SwaggerRelatedToFindOne() {
  return applyDecorators(
    ApiOperation({ summary: 'Get payment by ID' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Payment retrieved successfully',
      schema: {
        example: {
          statusCode: 200,
          message: 'Payment fetched successfully',
          data: paymentData,
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Payment not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Payment not found',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid payment ID format',
      schema: {
        example: {
          statusCode: 400,
          message: 'Invalid ID parameter',
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Unexpected server error',
      schema: {
        example: { statusCode: 500, message: 'Internal server error' },
      },
    }),
  );
}

export function SwaggerRelatedToGetPaymentsByPatient() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get payments by patient ID',
      description: 'Returns all payment records made by a specific patient.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Payments fetched successfully for the patient',
      schema: {
        example: {
          statusCode: 200,
          message: 'Payments for patient fetched successfully',
          data: [paymentData],
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'User not authorized to view these payments',
      schema: {
        example: {
          statusCode: 403,
          message: 'Forbidden resource',
          error: 'Forbidden',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Unexpected server error',
      schema: {
        example: {
          statusCode: 500,
          message: 'Internal server error',
        },
      },
    }),
  );
}

export function SwaggerRelatedToCancelPayment() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cancel a payment',
      description:
        'Cancels an existing payment. Only ADMIN, SUPERADMIN or the patient who made the payment can cancel it.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Payment successfully cancelled',
      schema: {
        example: {
          statusCode: 200,
          message: 'Payment cancelled successfully',
          data: {
            ...paymentData,
            status: 'CANCELLED',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Payment not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Payment not found',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Payment already cancelled or cannot be cancelled',
      schema: {
        example: {
          statusCode: 409,
          message: 'Payment already cancelled or not allowed to cancel',
          error: 'Conflict',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'User is not authorized to cancel this payment',
      schema: {
        example: {
          statusCode: 403,
          message: 'Forbidden: You cannot cancel this payment',
          error: 'Forbidden',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Unexpected server error',
      schema: {
        example: {
          statusCode: 500,
          message: 'Internal server error',
        },
      },
    }),
  );
}

export function SwaggerRelatedToDeletePayment() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a payment',
      description:
        'Deletes a specific payment record. Only ADMIN or SUPERADMIN can perform this action.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Payment successfully deleted',
      schema: {
        example: {
          statusCode: 200,
          message: 'Payment deleted successfully',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Payment not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Payment not found',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'User is not authorized to delete payments',
      schema: {
        example: {
          statusCode: 403,
          message: 'Forbidden: Only admin or superadmin can delete payments',
          error: 'Forbidden',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Unexpected server error',
      schema: {
        example: {
          statusCode: 500,
          message: 'Internal server error',
        },
      },
    }),
  );
}
