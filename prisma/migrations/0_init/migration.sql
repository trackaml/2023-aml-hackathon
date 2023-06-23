-- CreateTable
CREATE TABLE "beneficial_owner" (
    "id" BIGINT NOT NULL,
    "company_id" BIGINT,
    "stakehold_type" TEXT,
    "stakeholder_name" TEXT,
    "is_foreign" TEXT,
    "modal" TEXT,
    "share_capital_placed" BIGINT,
    "price_per_sheet" BIGINT,
    "total_share_placed" BIGINT,
    "position" TEXT,
    "identity_id" TEXT,
    "address" TEXT,
    "job" TEXT,
    "province" TEXT,
    "regency" TEXT,

    CONSTRAINT "beneficial_owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_profile" (
    "id" BIGINT NOT NULL,
    "company_name" TEXT,
    "address" TEXT,
    "postal_code" TEXT,
    "province_id" BIGINT,
    "province_name" TEXT,
    "regency_id" BIGINT,
    "regency_name" TEXT,

    CONSTRAINT "company_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PotentialRisk" (
    "id" BIGSERIAL NOT NULL,
    "company_name" TEXT,
    "risk1" REAL,
    "risk2" REAL,
    "total_risk" REAL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "company_id" BIGINT,

    CONSTRAINT "PotentialRisk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionData" (
    "id" BIGINT NOT NULL,
    "reporter_name" TEXT,
    "reporter_id" TEXT,
    "reporter_type" TEXT,
    "submited_date" TEXT,
    "reporting_reason" TEXT,
    "reporting_indicator" TEXT,
    "transaction_id" TEXT,
    "transaction_date" TEXT,
    "transaction_type" TEXT,
    "type_source" TEXT,
    "PEA_name_source" TEXT,
    "job_source" TEXT,
    "bank_account_name_source" TEXT,
    "country_source" TEXT,
    "instrument_source" TEXT,
    "type_dest" TEXT,
    "PEA_name_dest" TEXT,
    "job_dest" TEXT,
    "bank_account_name_dest" TEXT,
    "country_dest" TEXT,
    "instrument_dest" TEXT,
    "transaction_value" BIGINT,
    "transaction_location" TEXT,

    CONSTRAINT "TransactionData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "beneficial_owner" ADD CONSTRAINT "beneficial_owner_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company_profile"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

