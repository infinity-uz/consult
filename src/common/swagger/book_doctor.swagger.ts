import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { book_doctorData } from 'src/common/document/book_doctorData';

// =================== CREATE ===================
export function SwaggerRelatedToCreate() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new doctor booking' }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Booking successfully created',
      schema: {
        example: {
          statusCode: 201,
          message: 'Booking created successfully',
          data: book_doctorData,
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
      description: 'Booking already exists',
      schema: {
        example: {
          statusCode: 409,
          message: 'Booking for this patient and time already exists',
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

// =================== FIND ALL ===================
export function SwaggerRelatedToFindAll() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all doctor bookings (admin/superadmin only)',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'List of all bookings',
      schema: {
        example: {
          statusCode: 200,
          message: 'success',
          data: [book_doctorData],
        },
      },
    }),
  );
}

// =================== FIND ONE ===================
export function SwaggerRelatedToFindOne() {
  return applyDecorators(
    ApiOperation({ summary: 'Get booking by ID' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Booking found',
      schema: {
        example: {
          statusCode: 200,
          message: 'success',
          data: book_doctorData,
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Booking not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Booking not found',
          error: 'Not Found',
        },
      },
    }),
  );
}

// =================== UPDATE ===================
export function SwaggerRelatedToUpdate() {
  return applyDecorators(
    ApiOperation({ summary: 'Update booking details' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Booking successfully updated',
      schema: {
        example: {
          statusCode: 200,
          message: 'Booking updated successfully',
          data: book_doctorData,
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid update data',
      schema: {
        example: {
          statusCode: 400,
          message: 'Invalid field values',
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Booking not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Booking not found',
          error: 'Not Found',
        },
      },
    }),
  );
}

// =================== DELETE ===================
export function SwaggerRelatedToDelete() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete booking (admin/superadmin only)' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Booking successfully deleted',
      schema: {
        example: { statusCode: 200, message: 'Booking deleted successfully' },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Booking not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Booking not found',
          error: 'Not Found',
        },
      },
    }),
  );
}

// =================== CANCEL ===================
export function SwaggerRelatedToCancel() {
  return applyDecorators(
    ApiOperation({ summary: 'Cancel booking (patient only)' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Booking successfully cancelled',
      schema: {
        example: {
          statusCode: 200,
          message: 'Booking cancelled successfully',
          data: { ...book_doctorData, status: 'CANCELLED' },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Booking not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Booking not found',
          error: 'Not Found',
        },
      },
    }),
  );
}

// =================== CHANGE STATUS ===================
export function SwaggerRelatedToChangeStatus() {
  return applyDecorators(
    ApiOperation({ summary: 'Change booking status (doctor/admin)' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Booking status updated',
      schema: {
        example: {
          statusCode: 200,
          message: 'Status updated successfully',
          data: { ...book_doctorData, status: 'SUCCESS' },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid status value',
      schema: {
        example: {
          statusCode: 400,
          message: 'Invalid status',
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Booking not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Booking not found',
          error: 'Not Found',
        },
      },
    }),
  );
}
