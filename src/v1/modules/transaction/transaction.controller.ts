import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnprocessableEntityResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";
import { CurrentUser } from "@shared/decorators/current-user.decorator";
import { AuthenticatedUser } from "@shared/types";
import { CreateTransactionRequest, ListTransactionResponse, TransactionResponse } from "./dto";
import { TransactionService } from "./transaction.service";
import { TransactionMapper } from "./transaction.mapper";

@Controller("accounts/:accountNumber/transactions")
@ApiTags("transaction")
@ApiBearerAuth()
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly transactionMapper: TransactionMapper,
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a transaction" })
  @ApiCreatedResponse({
    description: "Transaction has been created successfully",
    type: TransactionResponse,
  })
  @ApiUnauthorizedResponse({ description: "Access token is missing or invalid" })
  @ApiInternalServerErrorResponse({ description: "Unexpected error occurred" })
  @ApiNotFoundResponse({ description: "Bank account was not found" })
  @ApiUnprocessableEntityResponse({ description: "Insufficient funds to process transaction" })
  @ApiBadRequestResponse({ description: "Invalid details supplied" })
  @ApiForbiddenResponse({ description: "User is not allowed to access the transactions" })
  @ApiInternalServerErrorResponse({ description: "An unexpected error occurred" })
  async create(
    @Param("accountNumber") accountNumber: string,
    @Body() dto: CreateTransactionRequest,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<TransactionResponse> {
    const transaction = await this.transactionService.create(accountNumber, user.internalId, dto);

    return this.transactionMapper.toResponseDto(transaction);
  }

  @Get()
  @ApiOperation({ summary: "List transactions for a bank account" })
  @ApiOkResponse({ description: "The list of transaction details", type: ListTransactionResponse })
  @ApiBadRequestResponse({ description: "Invalid details supplied" })
  @ApiUnauthorizedResponse({ description: "Access token is missing or invalid" })
  @ApiForbiddenResponse({ description: "User is not allowed to access the transactions" })
  @ApiNotFoundResponse({ description: "Bank account was not found" })
  @ApiInternalServerErrorResponse({ description: "An unexpected error occurred" })
  async findAllForAccount(
    @Param("accountNumber") accountNumber: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ListTransactionResponse> {
    const transactions = await this.transactionService.findAllForAccount(
      accountNumber,
      user.internalId,
    );

    const response = new ListTransactionResponse();
    response.transactions = transactions.map(this.transactionMapper.toResponseDto);

    return response;
  }

  @Get(":transactionId")
  @ApiOperation({ summary: "Fetch transaction by ID" })
  @ApiOkResponse({
    description: "The transaction details",
    type: TransactionResponse,
  })
  @ApiBadRequestResponse({ description: "Invalid details supplied" })
  @ApiUnauthorizedResponse({ description: "Access token is missing or invalid" })
  @ApiForbiddenResponse({ description: "User is not allowed to access the transactions" })
  @ApiNotFoundResponse({ description: "Bank account was not found" })
  @ApiInternalServerErrorResponse({ description: "An unexpected error occurred" })
  async findById(
    @Param("accountNumber") accountNumber: string,
    @Param("transactionId") transactionId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<TransactionResponse> {
    const transaction = await this.transactionService.findByExternalId(
      accountNumber,
      user.internalId,
      transactionId,
    );

    return this.transactionMapper.toResponseDto(transaction);
  }
}
