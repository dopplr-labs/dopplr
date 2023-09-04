export const TABLE_COLUMNS = [
  {
    schemaname: 'auth',
    tablename: 'audit_log_entries',
    quoted_name: 'auth.audit_log_entries',
    is_table: true,
    columns: [
      {
        attrelid: '29059',
        attname: 'created_at',
        data_type: 'timestamp with time zone',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '29059',
        attname: 'ip_address',
        data_type: 'character varying(64)',
        attnum: 5,
        attisdropped: false,
      },
      {
        attrelid: '29059',
        attname: 'instance_id',
        data_type: 'uuid',
        attnum: 1,
        attisdropped: false,
      },
      {
        attrelid: '29059',
        attname: 'id',
        data_type: 'uuid',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '29059',
        attname: 'payload',
        data_type: 'json',
        attnum: 3,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'auth',
    tablename: 'flow_state',
    quoted_name: 'auth.flow_state',
    is_table: true,
    columns: [
      {
        attrelid: '29065',
        attname: 'id',
        data_type: 'uuid',
        attnum: 1,
        attisdropped: false,
      },
      {
        attrelid: '29065',
        attname: 'user_id',
        data_type: 'uuid',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '29065',
        attname: 'auth_code',
        data_type: 'text',
        attnum: 3,
        attisdropped: false,
      },
      {
        attrelid: '29065',
        attname: 'provider_access_token',
        data_type: 'text',
        attnum: 7,
        attisdropped: false,
      },
      {
        attrelid: '29065',
        attname: 'provider_refresh_token',
        data_type: 'text',
        attnum: 8,
        attisdropped: false,
      },
      {
        attrelid: '29065',
        attname: 'created_at',
        data_type: 'timestamp with time zone',
        attnum: 9,
        attisdropped: false,
      },
      {
        attrelid: '29065',
        attname: 'updated_at',
        data_type: 'timestamp with time zone',
        attnum: 10,
        attisdropped: false,
      },
      {
        attrelid: '29065',
        attname: 'authentication_method',
        data_type: 'text',
        attnum: 11,
        attisdropped: false,
      },
      {
        attrelid: '29065',
        attname: 'code_challenge_method',
        data_type: 'auth.code_challenge_method',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '29065',
        attname: 'code_challenge',
        data_type: 'text',
        attnum: 5,
        attisdropped: false,
      },
      {
        attrelid: '29065',
        attname: 'provider_type',
        data_type: 'text',
        attnum: 6,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'auth',
    tablename: 'identities',
    quoted_name: 'auth.identities',
    is_table: true,
    columns: [
      {
        attrelid: '29070',
        attname: 'created_at',
        data_type: 'timestamp with time zone',
        attnum: 6,
        attisdropped: false,
      },
      {
        attrelid: '29070',
        attname: 'last_sign_in_at',
        data_type: 'timestamp with time zone',
        attnum: 5,
        attisdropped: false,
      },
      {
        attrelid: '29070',
        attname: 'provider',
        data_type: 'text',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '29070',
        attname: 'identity_data',
        data_type: 'jsonb',
        attnum: 3,
        attisdropped: false,
      },
      {
        attrelid: '29070',
        attname: 'user_id',
        data_type: 'uuid',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '29070',
        attname: 'id',
        data_type: 'text',
        attnum: 1,
        attisdropped: false,
      },
      {
        attrelid: '29070',
        attname: 'email',
        data_type: 'text',
        attnum: 8,
        attisdropped: false,
      },
      {
        attrelid: '29070',
        attname: 'updated_at',
        data_type: 'timestamp with time zone',
        attnum: 7,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'auth',
    tablename: 'instances',
    quoted_name: 'auth.instances',
    is_table: true,
    columns: [
      {
        attrelid: '29076',
        attname: 'uuid',
        data_type: 'uuid',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '29076',
        attname: 'raw_base_config',
        data_type: 'text',
        attnum: 3,
        attisdropped: false,
      },
      {
        attrelid: '29076',
        attname: 'created_at',
        data_type: 'timestamp with time zone',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '29076',
        attname: 'updated_at',
        data_type: 'timestamp with time zone',
        attnum: 5,
        attisdropped: false,
      },
      {
        attrelid: '29076',
        attname: 'id',
        data_type: 'uuid',
        attnum: 1,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'auth',
    tablename: 'mfa_amr_claims',
    quoted_name: 'auth.mfa_amr_claims',
    is_table: true,
    columns: [
      {
        attrelid: '29081',
        attname: 'created_at',
        data_type: 'timestamp with time zone',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '29081',
        attname: 'authentication_method',
        data_type: 'text',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '29081',
        attname: 'id',
        data_type: 'uuid',
        attnum: 5,
        attisdropped: false,
      },
      {
        attrelid: '29081',
        attname: 'session_id',
        data_type: 'uuid',
        attnum: 1,
        attisdropped: false,
      },
      {
        attrelid: '29081',
        attname: 'updated_at',
        data_type: 'timestamp with time zone',
        attnum: 3,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'auth',
    tablename: 'mfa_challenges',
    quoted_name: 'auth.mfa_challenges',
    is_table: true,
    columns: [
      {
        attrelid: '29086',
        attname: 'created_at',
        data_type: 'timestamp with time zone',
        attnum: 3,
        attisdropped: false,
      },
      {
        attrelid: '29086',
        attname: 'id',
        data_type: 'uuid',
        attnum: 1,
        attisdropped: false,
      },
      {
        attrelid: '29086',
        attname: 'factor_id',
        data_type: 'uuid',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '29086',
        attname: 'verified_at',
        data_type: 'timestamp with time zone',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '29086',
        attname: 'ip_address',
        data_type: 'inet',
        attnum: 5,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'auth',
    tablename: 'mfa_factors',
    quoted_name: 'auth.mfa_factors',
    is_table: true,
    columns: [
      {
        attrelid: '29091',
        attname: 'friendly_name',
        data_type: 'text',
        attnum: 3,
        attisdropped: false,
      },
      {
        attrelid: '29091',
        attname: 'created_at',
        data_type: 'timestamp with time zone',
        attnum: 6,
        attisdropped: false,
      },
      {
        attrelid: '29091',
        attname: 'updated_at',
        data_type: 'timestamp with time zone',
        attnum: 7,
        attisdropped: false,
      },
      {
        attrelid: '29091',
        attname: 'secret',
        data_type: 'text',
        attnum: 8,
        attisdropped: false,
      },
      {
        attrelid: '29091',
        attname: 'factor_type',
        data_type: 'auth.factor_type',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '29091',
        attname: 'id',
        data_type: 'uuid',
        attnum: 1,
        attisdropped: false,
      },
      {
        attrelid: '29091',
        attname: 'user_id',
        data_type: 'uuid',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '29091',
        attname: 'status',
        data_type: 'auth.factor_status',
        attnum: 5,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'auth',
    tablename: 'refresh_tokens',
    quoted_name: 'auth.refresh_tokens',
    is_table: true,
    columns: [
      {
        attrelid: '29096',
        attname: 'parent',
        data_type: 'character varying(255)',
        attnum: 8,
        attisdropped: false,
      },
      {
        attrelid: '29096',
        attname: 'updated_at',
        data_type: 'timestamp with time zone',
        attnum: 7,
        attisdropped: false,
      },
      {
        attrelid: '29096',
        attname: 'instance_id',
        data_type: 'uuid',
        attnum: 1,
        attisdropped: false,
      },
      {
        attrelid: '29096',
        attname: 'token',
        data_type: 'character varying(255)',
        attnum: 3,
        attisdropped: false,
      },
      {
        attrelid: '29096',
        attname: 'user_id',
        data_type: 'character varying(255)',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '29096',
        attname: 'id',
        data_type: 'bigint',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '29096',
        attname: 'session_id',
        data_type: 'uuid',
        attnum: 9,
        attisdropped: false,
      },
      {
        attrelid: '29096',
        attname: 'revoked',
        data_type: 'boolean',
        attnum: 5,
        attisdropped: false,
      },
      {
        attrelid: '29096',
        attname: 'created_at',
        data_type: 'timestamp with time zone',
        attnum: 6,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'auth',
    tablename: 'saml_providers',
    quoted_name: 'auth.saml_providers',
    is_table: true,
    columns: [
      {
        attrelid: '29102',
        attname: 'metadata_url',
        data_type: 'text',
        attnum: 5,
        attisdropped: false,
      },
      {
        attrelid: '29102',
        attname: 'id',
        data_type: 'uuid',
        attnum: 1,
        attisdropped: false,
      },
      {
        attrelid: '29102',
        attname: 'sso_provider_id',
        data_type: 'uuid',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '29102',
        attname: 'entity_id',
        data_type: 'text',
        attnum: 3,
        attisdropped: false,
      },
      {
        attrelid: '29102',
        attname: 'metadata_xml',
        data_type: 'text',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '29102',
        attname: 'attribute_mapping',
        data_type: 'jsonb',
        attnum: 6,
        attisdropped: false,
      },
      {
        attrelid: '29102',
        attname: 'created_at',
        data_type: 'timestamp with time zone',
        attnum: 7,
        attisdropped: false,
      },
      {
        attrelid: '29102',
        attname: 'updated_at',
        data_type: 'timestamp with time zone',
        attnum: 8,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'auth',
    tablename: 'saml_relay_states',
    quoted_name: 'auth.saml_relay_states',
    is_table: true,
    columns: [
      {
        attrelid: '29110',
        attname: 'created_at',
        data_type: 'timestamp with time zone',
        attnum: 7,
        attisdropped: false,
      },
      {
        attrelid: '29110',
        attname: 'redirect_to',
        data_type: 'text',
        attnum: 5,
        attisdropped: false,
      },
      {
        attrelid: '29110',
        attname: 'id',
        data_type: 'uuid',
        attnum: 1,
        attisdropped: false,
      },
      {
        attrelid: '29110',
        attname: 'sso_provider_id',
        data_type: 'uuid',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '29110',
        attname: 'request_id',
        data_type: 'text',
        attnum: 3,
        attisdropped: false,
      },
      {
        attrelid: '29110',
        attname: 'from_ip_address',
        data_type: 'inet',
        attnum: 6,
        attisdropped: false,
      },
      {
        attrelid: '29110',
        attname: 'updated_at',
        data_type: 'timestamp with time zone',
        attnum: 8,
        attisdropped: false,
      },
      {
        attrelid: '29110',
        attname: 'for_email',
        data_type: 'text',
        attnum: 4,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'auth',
    tablename: 'schema_migrations',
    quoted_name: 'auth.schema_migrations',
    is_table: true,
    columns: [
      {
        attrelid: '29116',
        attname: 'version',
        data_type: 'character varying(255)',
        attnum: 1,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'auth',
    tablename: 'sessions',
    quoted_name: 'auth.sessions',
    is_table: true,
    columns: [
      {
        attrelid: '29119',
        attname: 'user_id',
        data_type: 'uuid',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '29119',
        attname: 'not_after',
        data_type: 'timestamp with time zone',
        attnum: 7,
        attisdropped: false,
      },
      {
        attrelid: '29119',
        attname: 'aal',
        data_type: 'auth.aal_level',
        attnum: 6,
        attisdropped: false,
      },
      {
        attrelid: '29119',
        attname: 'factor_id',
        data_type: 'uuid',
        attnum: 5,
        attisdropped: false,
      },
      {
        attrelid: '29119',
        attname: 'updated_at',
        data_type: 'timestamp with time zone',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '29119',
        attname: 'id',
        data_type: 'uuid',
        attnum: 1,
        attisdropped: false,
      },
      {
        attrelid: '29119',
        attname: 'created_at',
        data_type: 'timestamp with time zone',
        attnum: 3,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'auth',
    tablename: 'sso_domains',
    quoted_name: 'auth.sso_domains',
    is_table: true,
    columns: [
      {
        attrelid: '29122',
        attname: 'created_at',
        data_type: 'timestamp with time zone',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '29122',
        attname: 'domain',
        data_type: 'text',
        attnum: 3,
        attisdropped: false,
      },
      {
        attrelid: '29122',
        attname: 'sso_provider_id',
        data_type: 'uuid',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '29122',
        attname: 'id',
        data_type: 'uuid',
        attnum: 1,
        attisdropped: false,
      },
      {
        attrelid: '29122',
        attname: 'updated_at',
        data_type: 'timestamp with time zone',
        attnum: 5,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'auth',
    tablename: 'sso_providers',
    quoted_name: 'auth.sso_providers',
    is_table: true,
    columns: [
      {
        attrelid: '29128',
        attname: 'resource_id',
        data_type: 'text',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '29128',
        attname: 'updated_at',
        data_type: 'timestamp with time zone',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '29128',
        attname: 'created_at',
        data_type: 'timestamp with time zone',
        attnum: 3,
        attisdropped: false,
      },
      {
        attrelid: '29128',
        attname: 'id',
        data_type: 'uuid',
        attnum: 1,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'auth',
    tablename: 'users',
    quoted_name: 'auth.users',
    is_table: true,
    columns: [
      {
        attrelid: '29134',
        attname: 'phone_change_token',
        data_type: 'character varying(255)',
        attnum: 25,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'phone_change',
        data_type: 'text',
        attnum: 24,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'reauthentication_token',
        data_type: 'character varying(255)',
        attnum: 31,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'deleted_at',
        data_type: 'timestamp with time zone',
        attnum: 34,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'reauthentication_sent_at',
        data_type: 'timestamp with time zone',
        attnum: 32,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'is_sso_user',
        data_type: 'boolean',
        attnum: 33,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'instance_id',
        data_type: 'uuid',
        attnum: 1,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'id',
        data_type: 'uuid',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'aud',
        data_type: 'character varying(255)',
        attnum: 3,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'role',
        data_type: 'character varying(255)',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'email',
        data_type: 'character varying(255)',
        attnum: 5,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'encrypted_password',
        data_type: 'character varying(255)',
        attnum: 6,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'email_confirmed_at',
        data_type: 'timestamp with time zone',
        attnum: 7,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'invited_at',
        data_type: 'timestamp with time zone',
        attnum: 8,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'confirmation_token',
        data_type: 'character varying(255)',
        attnum: 9,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'confirmation_sent_at',
        data_type: 'timestamp with time zone',
        attnum: 10,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'recovery_token',
        data_type: 'character varying(255)',
        attnum: 11,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'recovery_sent_at',
        data_type: 'timestamp with time zone',
        attnum: 12,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'email_change_token_new',
        data_type: 'character varying(255)',
        attnum: 13,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'email_change',
        data_type: 'character varying(255)',
        attnum: 14,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'email_change_sent_at',
        data_type: 'timestamp with time zone',
        attnum: 15,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'last_sign_in_at',
        data_type: 'timestamp with time zone',
        attnum: 16,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'raw_app_meta_data',
        data_type: 'jsonb',
        attnum: 17,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'raw_user_meta_data',
        data_type: 'jsonb',
        attnum: 18,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'is_super_admin',
        data_type: 'boolean',
        attnum: 19,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'created_at',
        data_type: 'timestamp with time zone',
        attnum: 20,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'updated_at',
        data_type: 'timestamp with time zone',
        attnum: 21,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'phone_confirmed_at',
        data_type: 'timestamp with time zone',
        attnum: 23,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'email_change_confirm_status',
        data_type: 'smallint',
        attnum: 29,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'phone',
        data_type: 'text',
        attnum: 22,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'banned_until',
        data_type: 'timestamp with time zone',
        attnum: 30,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'email_change_token_current',
        data_type: 'character varying(255)',
        attnum: 28,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'confirmed_at',
        data_type: 'timestamp with time zone',
        attnum: 27,
        attisdropped: false,
      },
      {
        attrelid: '29134',
        attname: 'phone_change_sent_at',
        data_type: 'timestamp with time zone',
        attnum: 26,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'extensions',
    tablename: 'pg_stat_statements',
    quoted_name: 'extensions.pg_stat_statements',
    is_table: false,
    columns: [
      {
        attrelid: '28884',
        attname: 'jit_emission_count',
        data_type: 'bigint',
        attnum: 42,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'userid',
        data_type: 'oid',
        attnum: 1,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'dbid',
        data_type: 'oid',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'toplevel',
        data_type: 'boolean',
        attnum: 3,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'queryid',
        data_type: 'bigint',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'query',
        data_type: 'text',
        attnum: 5,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'plans',
        data_type: 'bigint',
        attnum: 6,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'total_plan_time',
        data_type: 'double precision',
        attnum: 7,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'min_plan_time',
        data_type: 'double precision',
        attnum: 8,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'max_plan_time',
        data_type: 'double precision',
        attnum: 9,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'mean_plan_time',
        data_type: 'double precision',
        attnum: 10,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'stddev_plan_time',
        data_type: 'double precision',
        attnum: 11,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'calls',
        data_type: 'bigint',
        attnum: 12,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'total_exec_time',
        data_type: 'double precision',
        attnum: 13,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'min_exec_time',
        data_type: 'double precision',
        attnum: 14,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'max_exec_time',
        data_type: 'double precision',
        attnum: 15,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'mean_exec_time',
        data_type: 'double precision',
        attnum: 16,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'stddev_exec_time',
        data_type: 'double precision',
        attnum: 17,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'rows',
        data_type: 'bigint',
        attnum: 18,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'shared_blks_hit',
        data_type: 'bigint',
        attnum: 19,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'shared_blks_read',
        data_type: 'bigint',
        attnum: 20,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'shared_blks_dirtied',
        data_type: 'bigint',
        attnum: 21,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'shared_blks_written',
        data_type: 'bigint',
        attnum: 22,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'local_blks_hit',
        data_type: 'bigint',
        attnum: 23,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'local_blks_read',
        data_type: 'bigint',
        attnum: 24,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'local_blks_dirtied',
        data_type: 'bigint',
        attnum: 25,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'local_blks_written',
        data_type: 'bigint',
        attnum: 26,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'temp_blks_read',
        data_type: 'bigint',
        attnum: 27,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'temp_blks_written',
        data_type: 'bigint',
        attnum: 28,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'blk_read_time',
        data_type: 'double precision',
        attnum: 29,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'blk_write_time',
        data_type: 'double precision',
        attnum: 30,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'temp_blk_read_time',
        data_type: 'double precision',
        attnum: 31,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'temp_blk_write_time',
        data_type: 'double precision',
        attnum: 32,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'wal_records',
        data_type: 'bigint',
        attnum: 33,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'wal_fpi',
        data_type: 'bigint',
        attnum: 34,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'wal_bytes',
        data_type: 'numeric',
        attnum: 35,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'jit_functions',
        data_type: 'bigint',
        attnum: 36,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'jit_generation_time',
        data_type: 'double precision',
        attnum: 37,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'jit_inlining_count',
        data_type: 'bigint',
        attnum: 38,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'jit_inlining_time',
        data_type: 'double precision',
        attnum: 39,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'jit_optimization_count',
        data_type: 'bigint',
        attnum: 40,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'jit_optimization_time',
        data_type: 'double precision',
        attnum: 41,
        attisdropped: false,
      },
      {
        attrelid: '28884',
        attname: 'jit_emission_time',
        data_type: 'double precision',
        attnum: 43,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'extensions',
    tablename: 'pg_stat_statements_info',
    quoted_name: 'extensions.pg_stat_statements_info',
    is_table: false,
    columns: [
      {
        attrelid: '28873',
        attname: 'stats_reset',
        data_type: 'timestamp with time zone',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '28873',
        attname: 'dealloc',
        data_type: 'bigint',
        attnum: 1,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'pgsodium',
    tablename: 'decrypted_key',
    quoted_name: 'pgsodium.decrypted_key',
    is_table: false,
    columns: [
      {
        attrelid: '28836',
        attname: 'parent_key',
        data_type: 'uuid',
        attnum: 13,
        attisdropped: false,
      },
      {
        attrelid: '28836',
        attname: 'comment',
        data_type: 'text',
        attnum: 14,
        attisdropped: false,
      },
      {
        attrelid: '28836',
        attname: 'id',
        data_type: 'uuid',
        attnum: 1,
        attisdropped: false,
      },
      {
        attrelid: '28836',
        attname: 'status',
        data_type: 'pgsodium.key_status',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '28836',
        attname: 'created',
        data_type: 'timestamp with time zone',
        attnum: 3,
        attisdropped: false,
      },
      {
        attrelid: '28836',
        attname: 'expires',
        data_type: 'timestamp with time zone',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '28836',
        attname: 'decrypted_raw_key',
        data_type: 'bytea',
        attnum: 11,
        attisdropped: false,
      },
      {
        attrelid: '28836',
        attname: 'raw_key',
        data_type: 'bytea',
        attnum: 10,
        attisdropped: false,
      },
      {
        attrelid: '28836',
        attname: 'associated_data',
        data_type: 'text',
        attnum: 9,
        attisdropped: false,
      },
      {
        attrelid: '28836',
        attname: 'name',
        data_type: 'text',
        attnum: 8,
        attisdropped: false,
      },
      {
        attrelid: '28836',
        attname: 'key_context',
        data_type: 'bytea',
        attnum: 7,
        attisdropped: false,
      },
      {
        attrelid: '28836',
        attname: 'key_id',
        data_type: 'bigint',
        attnum: 6,
        attisdropped: false,
      },
      {
        attrelid: '28836',
        attname: 'key_type',
        data_type: 'pgsodium.key_type',
        attnum: 5,
        attisdropped: false,
      },
      {
        attrelid: '28836',
        attname: 'raw_key_nonce',
        data_type: 'bytea',
        attnum: 12,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'pgsodium',
    tablename: 'key',
    quoted_name: 'pgsodium.key',
    is_table: true,
    columns: [
      {
        attrelid: '28686',
        attname: 'associated_data',
        data_type: 'text',
        attnum: 9,
        attisdropped: false,
      },
      {
        attrelid: '28686',
        attname: 'user_data',
        data_type: 'text',
        attnum: 14,
        attisdropped: false,
      },
      {
        attrelid: '28686',
        attname: 'comment',
        data_type: 'text',
        attnum: 13,
        attisdropped: false,
      },
      {
        attrelid: '28686',
        attname: 'parent_key',
        data_type: 'uuid',
        attnum: 12,
        attisdropped: false,
      },
      {
        attrelid: '28686',
        attname: 'raw_key_nonce',
        data_type: 'bytea',
        attnum: 11,
        attisdropped: false,
      },
      {
        attrelid: '28686',
        attname: 'raw_key',
        data_type: 'bytea',
        attnum: 10,
        attisdropped: false,
      },
      {
        attrelid: '28686',
        attname: 'name',
        data_type: 'text',
        attnum: 8,
        attisdropped: false,
      },
      {
        attrelid: '28686',
        attname: 'key_context',
        data_type: 'bytea',
        attnum: 7,
        attisdropped: false,
      },
      {
        attrelid: '28686',
        attname: 'key_id',
        data_type: 'bigint',
        attnum: 6,
        attisdropped: false,
      },
      {
        attrelid: '28686',
        attname: 'key_type',
        data_type: 'pgsodium.key_type',
        attnum: 5,
        attisdropped: false,
      },
      {
        attrelid: '28686',
        attname: 'expires',
        data_type: 'timestamp with time zone',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '28686',
        attname: 'created',
        data_type: 'timestamp with time zone',
        attnum: 3,
        attisdropped: false,
      },
      {
        attrelid: '28686',
        attname: 'status',
        data_type: 'pgsodium.key_status',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '28686',
        attname: 'id',
        data_type: 'uuid',
        attnum: 1,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'pgsodium',
    tablename: 'mask_columns',
    quoted_name: 'pgsodium.mask_columns',
    is_table: false,
    columns: [
      {
        attrelid: '28811',
        attname: 'attrelid',
        data_type: 'oid',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '28811',
        attname: 'key_id',
        data_type: 'text',
        attnum: 3,
        attisdropped: false,
      },
      {
        attrelid: '28811',
        attname: 'key_id_column',
        data_type: 'text',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '28811',
        attname: 'associated_columns',
        data_type: 'text',
        attnum: 5,
        attisdropped: false,
      },
      {
        attrelid: '28811',
        attname: 'nonce_column',
        data_type: 'text',
        attnum: 6,
        attisdropped: false,
      },
      {
        attrelid: '28811',
        attname: 'format_type',
        data_type: 'text',
        attnum: 7,
        attisdropped: false,
      },
      {
        attrelid: '28811',
        attname: 'attname',
        data_type: 'name',
        attnum: 1,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'pgsodium',
    tablename: 'masking_rule',
    quoted_name: 'pgsodium.masking_rule',
    is_table: false,
    columns: [
      {
        attrelid: '28806',
        attname: 'col_description',
        data_type: 'text',
        attnum: 7,
        attisdropped: false,
      },
      {
        attrelid: '28806',
        attname: 'format_type',
        data_type: 'text',
        attnum: 6,
        attisdropped: false,
      },
      {
        attrelid: '28806',
        attname: 'attname',
        data_type: 'name',
        attnum: 5,
        attisdropped: false,
      },
      {
        attrelid: '28806',
        attname: 'relname',
        data_type: 'name',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '28806',
        attname: 'relnamespace',
        data_type: 'regnamespace',
        attnum: 3,
        attisdropped: false,
      },
      {
        attrelid: '28806',
        attname: 'attnum',
        data_type: 'integer',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '28806',
        attname: 'attrelid',
        data_type: 'oid',
        attnum: 1,
        attisdropped: false,
      },
      {
        attrelid: '28806',
        attname: 'nonce_column',
        data_type: 'text',
        attnum: 11,
        attisdropped: false,
      },
      {
        attrelid: '28806',
        attname: 'view_name',
        data_type: 'text',
        attnum: 12,
        attisdropped: false,
      },
      {
        attrelid: '28806',
        attname: 'key_id_column',
        data_type: 'text',
        attnum: 8,
        attisdropped: false,
      },
      {
        attrelid: '28806',
        attname: 'associated_columns',
        data_type: 'text',
        attnum: 10,
        attisdropped: false,
      },
      {
        attrelid: '28806',
        attname: 'key_id',
        data_type: 'text',
        attnum: 9,
        attisdropped: false,
      },
      {
        attrelid: '28806',
        attname: 'priority',
        data_type: 'integer',
        attnum: 13,
        attisdropped: false,
      },
      {
        attrelid: '28806',
        attname: 'security_invoker',
        data_type: 'boolean',
        attnum: 14,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'pgsodium',
    tablename: 'valid_key',
    quoted_name: 'pgsodium.valid_key',
    is_table: false,
    columns: [
      {
        attrelid: '28790',
        attname: 'name',
        data_type: 'text',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '28790',
        attname: 'key_type',
        data_type: 'pgsodium.key_type',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '28790',
        attname: 'expires',
        data_type: 'timestamp with time zone',
        attnum: 8,
        attisdropped: false,
      },
      {
        attrelid: '28790',
        attname: 'created',
        data_type: 'timestamp with time zone',
        attnum: 7,
        attisdropped: false,
      },
      {
        attrelid: '28790',
        attname: 'key_context',
        data_type: 'bytea',
        attnum: 6,
        attisdropped: false,
      },
      {
        attrelid: '28790',
        attname: 'associated_data',
        data_type: 'text',
        attnum: 9,
        attisdropped: false,
      },
      {
        attrelid: '28790',
        attname: 'key_id',
        data_type: 'bigint',
        attnum: 5,
        attisdropped: false,
      },
      {
        attrelid: '28790',
        attname: 'id',
        data_type: 'uuid',
        attnum: 1,
        attisdropped: false,
      },
      {
        attrelid: '28790',
        attname: 'status',
        data_type: 'pgsodium.key_status',
        attnum: 3,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'public',
    tablename: 'Blog',
    quoted_name: 'public."Blog"',
    is_table: true,
    columns: [
      {
        attrelid: '29406',
        attname: 'id',
        data_type: 'bigint',
        attnum: 1,
        attisdropped: false,
      },
      {
        attrelid: '29406',
        attname: 'created_at',
        data_type: 'timestamp with time zone',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '29406',
        attname: 'updated_at',
        data_type: 'timestamp with time zone',
        attnum: 3,
        attisdropped: false,
      },
      {
        attrelid: '29406',
        attname: 'title',
        data_type: 'character varying',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '29406',
        attname: 'description',
        data_type: 'text',
        attnum: 5,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'realtime',
    tablename: 'schema_migrations',
    quoted_name: 'realtime.schema_migrations',
    is_table: true,
    columns: [
      {
        attrelid: '29148',
        attname: 'inserted_at',
        data_type: 'timestamp(0) without time zone',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '29148',
        attname: 'version',
        data_type: 'bigint',
        attnum: 1,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'realtime',
    tablename: 'subscription',
    quoted_name: 'realtime.subscription',
    is_table: true,
    columns: [
      {
        attrelid: '29151',
        attname: 'claims',
        data_type: 'jsonb',
        attnum: 5,
        attisdropped: false,
      },
      {
        attrelid: '29151',
        attname: 'filters',
        data_type: 'realtime.user_defined_filter[]',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '29151',
        attname: 'created_at',
        data_type: 'timestamp without time zone',
        attnum: 7,
        attisdropped: false,
      },
      {
        attrelid: '29151',
        attname: 'subscription_id',
        data_type: 'uuid',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '29151',
        attname: 'id',
        data_type: 'bigint',
        attnum: 1,
        attisdropped: false,
      },
      {
        attrelid: '29151',
        attname: 'entity',
        data_type: 'regclass',
        attnum: 3,
        attisdropped: false,
      },
      {
        attrelid: '29151',
        attname: 'claims_role',
        data_type: 'regrole',
        attnum: 6,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'storage',
    tablename: 'buckets',
    quoted_name: 'storage.buckets',
    is_table: true,
    columns: [
      {
        attrelid: '29160',
        attname: 'file_size_limit',
        data_type: 'bigint',
        attnum: 8,
        attisdropped: false,
      },
      {
        attrelid: '29160',
        attname: 'public',
        data_type: 'boolean',
        attnum: 6,
        attisdropped: false,
      },
      {
        attrelid: '29160',
        attname: 'updated_at',
        data_type: 'timestamp with time zone',
        attnum: 5,
        attisdropped: false,
      },
      {
        attrelid: '29160',
        attname: 'created_at',
        data_type: 'timestamp with time zone',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '29160',
        attname: 'owner',
        data_type: 'uuid',
        attnum: 3,
        attisdropped: false,
      },
      {
        attrelid: '29160',
        attname: 'name',
        data_type: 'text',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '29160',
        attname: 'id',
        data_type: 'text',
        attnum: 1,
        attisdropped: false,
      },
      {
        attrelid: '29160',
        attname: 'allowed_mime_types',
        data_type: 'text[]',
        attnum: 9,
        attisdropped: false,
      },
      {
        attrelid: '29160',
        attname: 'avif_autodetection',
        data_type: 'boolean',
        attnum: 7,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'storage',
    tablename: 'migrations',
    quoted_name: 'storage.migrations',
    is_table: true,
    columns: [
      {
        attrelid: '29169',
        attname: 'name',
        data_type: 'character varying(100)',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '29169',
        attname: 'id',
        data_type: 'integer',
        attnum: 1,
        attisdropped: false,
      },
      {
        attrelid: '29169',
        attname: 'executed_at',
        data_type: 'timestamp without time zone',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '29169',
        attname: 'hash',
        data_type: 'character varying(40)',
        attnum: 3,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'storage',
    tablename: 'objects',
    quoted_name: 'storage.objects',
    is_table: true,
    columns: [
      {
        attrelid: '29173',
        attname: 'version',
        data_type: 'text',
        attnum: 10,
        attisdropped: false,
      },
      {
        attrelid: '29173',
        attname: 'metadata',
        data_type: 'jsonb',
        attnum: 8,
        attisdropped: false,
      },
      {
        attrelid: '29173',
        attname: 'last_accessed_at',
        data_type: 'timestamp with time zone',
        attnum: 7,
        attisdropped: false,
      },
      {
        attrelid: '29173',
        attname: 'updated_at',
        data_type: 'timestamp with time zone',
        attnum: 6,
        attisdropped: false,
      },
      {
        attrelid: '29173',
        attname: 'created_at',
        data_type: 'timestamp with time zone',
        attnum: 5,
        attisdropped: false,
      },
      {
        attrelid: '29173',
        attname: 'owner',
        data_type: 'uuid',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '29173',
        attname: 'name',
        data_type: 'text',
        attnum: 3,
        attisdropped: false,
      },
      {
        attrelid: '29173',
        attname: 'bucket_id',
        data_type: 'text',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '29173',
        attname: 'id',
        data_type: 'uuid',
        attnum: 1,
        attisdropped: false,
      },
      {
        attrelid: '29173',
        attname: 'path_tokens',
        data_type: 'text[]',
        attnum: 9,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'vault',
    tablename: 'decrypted_secrets',
    quoted_name: 'vault.decrypted_secrets',
    is_table: false,
    columns: [
      {
        attrelid: '28953',
        attname: 'description',
        data_type: 'text',
        attnum: 3,
        attisdropped: false,
      },
      {
        attrelid: '28953',
        attname: 'key_id',
        data_type: 'uuid',
        attnum: 6,
        attisdropped: false,
      },
      {
        attrelid: '28953',
        attname: 'nonce',
        data_type: 'bytea',
        attnum: 7,
        attisdropped: false,
      },
      {
        attrelid: '28953',
        attname: 'created_at',
        data_type: 'timestamp with time zone',
        attnum: 8,
        attisdropped: false,
      },
      {
        attrelid: '28953',
        attname: 'updated_at',
        data_type: 'timestamp with time zone',
        attnum: 9,
        attisdropped: false,
      },
      {
        attrelid: '28953',
        attname: 'secret',
        data_type: 'text',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '28953',
        attname: 'decrypted_secret',
        data_type: 'text',
        attnum: 5,
        attisdropped: false,
      },
      {
        attrelid: '28953',
        attname: 'name',
        data_type: 'text',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '28953',
        attname: 'id',
        data_type: 'uuid',
        attnum: 1,
        attisdropped: false,
      },
    ],
  },
  {
    schemaname: 'vault',
    tablename: 'secrets',
    quoted_name: 'vault.secrets',
    is_table: true,
    columns: [
      {
        attrelid: '28934',
        attname: 'updated_at',
        data_type: 'timestamp with time zone',
        attnum: 8,
        attisdropped: false,
      },
      {
        attrelid: '28934',
        attname: 'created_at',
        data_type: 'timestamp with time zone',
        attnum: 7,
        attisdropped: false,
      },
      {
        attrelid: '28934',
        attname: 'nonce',
        data_type: 'bytea',
        attnum: 6,
        attisdropped: false,
      },
      {
        attrelid: '28934',
        attname: 'key_id',
        data_type: 'uuid',
        attnum: 5,
        attisdropped: false,
      },
      {
        attrelid: '28934',
        attname: 'secret',
        data_type: 'text',
        attnum: 4,
        attisdropped: false,
      },
      {
        attrelid: '28934',
        attname: 'description',
        data_type: 'text',
        attnum: 3,
        attisdropped: false,
      },
      {
        attrelid: '28934',
        attname: 'name',
        data_type: 'text',
        attnum: 2,
        attisdropped: false,
      },
      {
        attrelid: '28934',
        attname: 'id',
        data_type: 'uuid',
        attnum: 1,
        attisdropped: false,
      },
    ],
  },
]

export const SCHEMAS = [
  {
    name: 'auth',
  },
  {
    name: 'extensions',
  },
  {
    name: 'graphql',
  },
  {
    name: 'graphql_public',
  },
  {
    name: 'pgsodium',
  },
  {
    name: 'pgsodium_masks',
  },
  {
    name: 'public',
  },
  {
    name: 'realtime',
  },
  {
    name: 'storage',
  },
  {
    name: 'vault',
  },
]

export const KEYWORDS = [
  {
    word: 'abort',
  },
  {
    word: 'absolute',
  },
  {
    word: 'access',
  },
  {
    word: 'action',
  },
  {
    word: 'add',
  },
  {
    word: 'admin',
  },
  {
    word: 'after',
  },
  {
    word: 'aggregate',
  },
  {
    word: 'all',
  },
  {
    word: 'also',
  },
  {
    word: 'alter',
  },
  {
    word: 'always',
  },
  {
    word: 'analyse',
  },
  {
    word: 'analyze',
  },
  {
    word: 'and',
  },
  {
    word: 'any',
  },
  {
    word: 'array',
  },
  {
    word: 'as',
  },
  {
    word: 'asc',
  },
  {
    word: 'asensitive',
  },
  {
    word: 'assertion',
  },
  {
    word: 'assignment',
  },
  {
    word: 'asymmetric',
  },
  {
    word: 'at',
  },
  {
    word: 'atomic',
  },
  {
    word: 'attach',
  },
  {
    word: 'attribute',
  },
  {
    word: 'authorization',
  },
  {
    word: 'backward',
  },
  {
    word: 'before',
  },
  {
    word: 'begin',
  },
  {
    word: 'between',
  },
  {
    word: 'bigint',
  },
  {
    word: 'binary',
  },
  {
    word: 'bit',
  },
  {
    word: 'boolean',
  },
  {
    word: 'both',
  },
  {
    word: 'breadth',
  },
  {
    word: 'by',
  },
  {
    word: 'cache',
  },
  {
    word: 'call',
  },
  {
    word: 'called',
  },
  {
    word: 'cascade',
  },
  {
    word: 'cascaded',
  },
  {
    word: 'case',
  },
  {
    word: 'cast',
  },
  {
    word: 'catalog',
  },
  {
    word: 'chain',
  },
  {
    word: 'char',
  },
  {
    word: 'character',
  },
  {
    word: 'characteristics',
  },
  {
    word: 'check',
  },
  {
    word: 'checkpoint',
  },
  {
    word: 'class',
  },
  {
    word: 'close',
  },
  {
    word: 'cluster',
  },
  {
    word: 'coalesce',
  },
  {
    word: 'collate',
  },
  {
    word: 'collation',
  },
  {
    word: 'column',
  },
  {
    word: 'columns',
  },
  {
    word: 'comment',
  },
  {
    word: 'comments',
  },
  {
    word: 'commit',
  },
  {
    word: 'committed',
  },
  {
    word: 'compression',
  },
  {
    word: 'concurrently',
  },
  {
    word: 'configuration',
  },
  {
    word: 'conflict',
  },
  {
    word: 'connection',
  },
  {
    word: 'constraint',
  },
  {
    word: 'constraints',
  },
  {
    word: 'content',
  },
  {
    word: 'continue',
  },
  {
    word: 'conversion',
  },
  {
    word: 'copy',
  },
  {
    word: 'cost',
  },
  {
    word: 'create',
  },
  {
    word: 'cross',
  },
  {
    word: 'csv',
  },
  {
    word: 'cube',
  },
  {
    word: 'current',
  },
  {
    word: 'current_catalog',
  },
  {
    word: 'current_date',
  },
  {
    word: 'current_role',
  },
  {
    word: 'current_schema',
  },
  {
    word: 'current_time',
  },
  {
    word: 'current_timestamp',
  },
  {
    word: 'current_user',
  },
  {
    word: 'cursor',
  },
  {
    word: 'cycle',
  },
  {
    word: 'data',
  },
  {
    word: 'database',
  },
  {
    word: 'day',
  },
  {
    word: 'deallocate',
  },
  {
    word: 'dec',
  },
  {
    word: 'decimal',
  },
  {
    word: 'declare',
  },
  {
    word: 'default',
  },
  {
    word: 'defaults',
  },
  {
    word: 'deferrable',
  },
  {
    word: 'deferred',
  },
  {
    word: 'definer',
  },
  {
    word: 'delete',
  },
  {
    word: 'delimiter',
  },
  {
    word: 'delimiters',
  },
  {
    word: 'depends',
  },
  {
    word: 'depth',
  },
  {
    word: 'desc',
  },
  {
    word: 'detach',
  },
  {
    word: 'dictionary',
  },
  {
    word: 'disable',
  },
  {
    word: 'discard',
  },
  {
    word: 'distinct',
  },
  {
    word: 'do',
  },
  {
    word: 'document',
  },
  {
    word: 'domain',
  },
  {
    word: 'double',
  },
  {
    word: 'drop',
  },
  {
    word: 'each',
  },
  {
    word: 'else',
  },
  {
    word: 'enable',
  },
  {
    word: 'encoding',
  },
  {
    word: 'encrypted',
  },
  {
    word: 'end',
  },
  {
    word: 'enum',
  },
  {
    word: 'escape',
  },
  {
    word: 'event',
  },
  {
    word: 'except',
  },
  {
    word: 'exclude',
  },
  {
    word: 'excluding',
  },
  {
    word: 'exclusive',
  },
  {
    word: 'execute',
  },
  {
    word: 'exists',
  },
  {
    word: 'explain',
  },
  {
    word: 'expression',
  },
  {
    word: 'extension',
  },
  {
    word: 'external',
  },
  {
    word: 'extract',
  },
  {
    word: 'false',
  },
  {
    word: 'family',
  },
  {
    word: 'fetch',
  },
  {
    word: 'filter',
  },
  {
    word: 'finalize',
  },
  {
    word: 'first',
  },
  {
    word: 'float',
  },
  {
    word: 'following',
  },
  {
    word: 'for',
  },
  {
    word: 'force',
  },
  {
    word: 'foreign',
  },
  {
    word: 'forward',
  },
  {
    word: 'freeze',
  },
  {
    word: 'from',
  },
  {
    word: 'full',
  },
  {
    word: 'function',
  },
  {
    word: 'functions',
  },
  {
    word: 'generated',
  },
  {
    word: 'global',
  },
  {
    word: 'grant',
  },
  {
    word: 'granted',
  },
  {
    word: 'greatest',
  },
  {
    word: 'group',
  },
  {
    word: 'grouping',
  },
  {
    word: 'groups',
  },
  {
    word: 'handler',
  },
  {
    word: 'having',
  },
  {
    word: 'header',
  },
  {
    word: 'hold',
  },
  {
    word: 'hour',
  },
  {
    word: 'identity',
  },
  {
    word: 'if',
  },
  {
    word: 'ilike',
  },
  {
    word: 'immediate',
  },
  {
    word: 'immutable',
  },
  {
    word: 'implicit',
  },
  {
    word: 'import',
  },
  {
    word: 'in',
  },
  {
    word: 'include',
  },
  {
    word: 'including',
  },
  {
    word: 'increment',
  },
  {
    word: 'index',
  },
  {
    word: 'indexes',
  },
  {
    word: 'inherit',
  },
  {
    word: 'inherits',
  },
  {
    word: 'initially',
  },
  {
    word: 'inline',
  },
  {
    word: 'inner',
  },
  {
    word: 'inout',
  },
  {
    word: 'input',
  },
  {
    word: 'insensitive',
  },
  {
    word: 'insert',
  },
  {
    word: 'instead',
  },
  {
    word: 'int',
  },
  {
    word: 'integer',
  },
  {
    word: 'intersect',
  },
  {
    word: 'interval',
  },
  {
    word: 'into',
  },
  {
    word: 'invoker',
  },
  {
    word: 'is',
  },
  {
    word: 'isnull',
  },
  {
    word: 'isolation',
  },
  {
    word: 'join',
  },
  {
    word: 'key',
  },
  {
    word: 'label',
  },
  {
    word: 'language',
  },
  {
    word: 'large',
  },
  {
    word: 'last',
  },
  {
    word: 'lateral',
  },
  {
    word: 'leading',
  },
  {
    word: 'leakproof',
  },
  {
    word: 'least',
  },
  {
    word: 'left',
  },
  {
    word: 'level',
  },
  {
    word: 'like',
  },
  {
    word: 'limit',
  },
  {
    word: 'listen',
  },
  {
    word: 'load',
  },
  {
    word: 'local',
  },
  {
    word: 'localtime',
  },
  {
    word: 'localtimestamp',
  },
  {
    word: 'location',
  },
  {
    word: 'lock',
  },
  {
    word: 'locked',
  },
  {
    word: 'logged',
  },
  {
    word: 'mapping',
  },
  {
    word: 'match',
  },
  {
    word: 'matched',
  },
  {
    word: 'materialized',
  },
  {
    word: 'maxvalue',
  },
  {
    word: 'merge',
  },
  {
    word: 'method',
  },
  {
    word: 'minute',
  },
  {
    word: 'minvalue',
  },
  {
    word: 'mode',
  },
  {
    word: 'month',
  },
  {
    word: 'move',
  },
  {
    word: 'name',
  },
  {
    word: 'names',
  },
  {
    word: 'national',
  },
  {
    word: 'natural',
  },
  {
    word: 'nchar',
  },
  {
    word: 'new',
  },
  {
    word: 'next',
  },
  {
    word: 'nfc',
  },
  {
    word: 'nfd',
  },
  {
    word: 'nfkc',
  },
  {
    word: 'nfkd',
  },
  {
    word: 'no',
  },
  {
    word: 'none',
  },
  {
    word: 'normalize',
  },
  {
    word: 'normalized',
  },
  {
    word: 'not',
  },
  {
    word: 'nothing',
  },
  {
    word: 'notify',
  },
  {
    word: 'notnull',
  },
  {
    word: 'nowait',
  },
  {
    word: 'null',
  },
  {
    word: 'nullif',
  },
  {
    word: 'nulls',
  },
  {
    word: 'numeric',
  },
  {
    word: 'object',
  },
  {
    word: 'of',
  },
  {
    word: 'off',
  },
  {
    word: 'offset',
  },
  {
    word: 'oids',
  },
  {
    word: 'old',
  },
  {
    word: 'on',
  },
  {
    word: 'only',
  },
  {
    word: 'operator',
  },
  {
    word: 'option',
  },
  {
    word: 'options',
  },
  {
    word: 'or',
  },
  {
    word: 'order',
  },
  {
    word: 'ordinality',
  },
  {
    word: 'others',
  },
  {
    word: 'out',
  },
  {
    word: 'outer',
  },
  {
    word: 'over',
  },
  {
    word: 'overlaps',
  },
  {
    word: 'overlay',
  },
  {
    word: 'overriding',
  },
  {
    word: 'owned',
  },
  {
    word: 'owner',
  },
  {
    word: 'parallel',
  },
  {
    word: 'parameter',
  },
  {
    word: 'parser',
  },
  {
    word: 'partial',
  },
  {
    word: 'partition',
  },
  {
    word: 'passing',
  },
  {
    word: 'password',
  },
  {
    word: 'placing',
  },
  {
    word: 'plans',
  },
  {
    word: 'policy',
  },
  {
    word: 'position',
  },
  {
    word: 'preceding',
  },
  {
    word: 'precision',
  },
  {
    word: 'prepare',
  },
  {
    word: 'prepared',
  },
  {
    word: 'preserve',
  },
  {
    word: 'primary',
  },
  {
    word: 'prior',
  },
  {
    word: 'privileges',
  },
  {
    word: 'procedural',
  },
  {
    word: 'procedure',
  },
  {
    word: 'procedures',
  },
  {
    word: 'program',
  },
  {
    word: 'publication',
  },
  {
    word: 'quote',
  },
  {
    word: 'range',
  },
  {
    word: 'read',
  },
  {
    word: 'real',
  },
  {
    word: 'reassign',
  },
  {
    word: 'recheck',
  },
  {
    word: 'recursive',
  },
  {
    word: 'ref',
  },
  {
    word: 'references',
  },
  {
    word: 'referencing',
  },
  {
    word: 'refresh',
  },
  {
    word: 'reindex',
  },
  {
    word: 'relative',
  },
  {
    word: 'release',
  },
  {
    word: 'rename',
  },
  {
    word: 'repeatable',
  },
  {
    word: 'replace',
  },
  {
    word: 'replica',
  },
  {
    word: 'reset',
  },
  {
    word: 'restart',
  },
  {
    word: 'restrict',
  },
  {
    word: 'return',
  },
  {
    word: 'returning',
  },
  {
    word: 'returns',
  },
  {
    word: 'revoke',
  },
  {
    word: 'right',
  },
  {
    word: 'role',
  },
  {
    word: 'rollback',
  },
  {
    word: 'rollup',
  },
  {
    word: 'routine',
  },
  {
    word: 'routines',
  },
  {
    word: 'row',
  },
  {
    word: 'rows',
  },
  {
    word: 'rule',
  },
  {
    word: 'savepoint',
  },
  {
    word: 'schema',
  },
  {
    word: 'schemas',
  },
  {
    word: 'scroll',
  },
  {
    word: 'search',
  },
  {
    word: 'second',
  },
  {
    word: 'security',
  },
  {
    word: 'select',
  },
  {
    word: 'sequence',
  },
  {
    word: 'sequences',
  },
  {
    word: 'serializable',
  },
  {
    word: 'server',
  },
  {
    word: 'session',
  },
  {
    word: 'session_user',
  },
  {
    word: 'set',
  },
  {
    word: 'setof',
  },
  {
    word: 'sets',
  },
  {
    word: 'share',
  },
  {
    word: 'show',
  },
  {
    word: 'similar',
  },
  {
    word: 'simple',
  },
  {
    word: 'skip',
  },
  {
    word: 'smallint',
  },
  {
    word: 'snapshot',
  },
  {
    word: 'some',
  },
  {
    word: 'sql',
  },
  {
    word: 'stable',
  },
  {
    word: 'standalone',
  },
  {
    word: 'start',
  },
  {
    word: 'statement',
  },
  {
    word: 'statistics',
  },
  {
    word: 'stdin',
  },
  {
    word: 'stdout',
  },
  {
    word: 'storage',
  },
  {
    word: 'stored',
  },
  {
    word: 'strict',
  },
  {
    word: 'strip',
  },
  {
    word: 'subscription',
  },
  {
    word: 'substring',
  },
  {
    word: 'support',
  },
  {
    word: 'symmetric',
  },
  {
    word: 'sysid',
  },
  {
    word: 'system',
  },
  {
    word: 'table',
  },
  {
    word: 'tables',
  },
  {
    word: 'tablesample',
  },
  {
    word: 'tablespace',
  },
  {
    word: 'temp',
  },
  {
    word: 'template',
  },
  {
    word: 'temporary',
  },
  {
    word: 'text',
  },
  {
    word: 'then',
  },
  {
    word: 'ties',
  },
  {
    word: 'time',
  },
  {
    word: 'timestamp',
  },
  {
    word: 'to',
  },
  {
    word: 'trailing',
  },
  {
    word: 'transaction',
  },
  {
    word: 'transform',
  },
  {
    word: 'treat',
  },
  {
    word: 'trigger',
  },
  {
    word: 'trim',
  },
  {
    word: 'true',
  },
  {
    word: 'truncate',
  },
  {
    word: 'trusted',
  },
  {
    word: 'type',
  },
  {
    word: 'types',
  },
  {
    word: 'uescape',
  },
  {
    word: 'unbounded',
  },
  {
    word: 'uncommitted',
  },
  {
    word: 'unencrypted',
  },
  {
    word: 'union',
  },
  {
    word: 'unique',
  },
  {
    word: 'unknown',
  },
  {
    word: 'unlisten',
  },
  {
    word: 'unlogged',
  },
  {
    word: 'until',
  },
  {
    word: 'update',
  },
  {
    word: 'user',
  },
  {
    word: 'using',
  },
  {
    word: 'vacuum',
  },
  {
    word: 'valid',
  },
  {
    word: 'validate',
  },
  {
    word: 'validator',
  },
  {
    word: 'value',
  },
  {
    word: 'values',
  },
  {
    word: 'varchar',
  },
  {
    word: 'variadic',
  },
  {
    word: 'varying',
  },
  {
    word: 'verbose',
  },
  {
    word: 'version',
  },
  {
    word: 'view',
  },
  {
    word: 'views',
  },
  {
    word: 'volatile',
  },
  {
    word: 'when',
  },
  {
    word: 'where',
  },
  {
    word: 'whitespace',
  },
  {
    word: 'window',
  },
  {
    word: 'with',
  },
  {
    word: 'within',
  },
  {
    word: 'without',
  },
  {
    word: 'work',
  },
  {
    word: 'wrapper',
  },
  {
    word: 'write',
  },
  {
    word: 'xml',
  },
  {
    word: 'xmlattributes',
  },
  {
    word: 'xmlconcat',
  },
  {
    word: 'xmlelement',
  },
  {
    word: 'xmlexists',
  },
  {
    word: 'xmlforest',
  },
  {
    word: 'xmlnamespaces',
  },
  {
    word: 'xmlparse',
  },
  {
    word: 'xmlpi',
  },
  {
    word: 'xmlroot',
  },
  {
    word: 'xmlserialize',
  },
  {
    word: 'xmltable',
  },
  {
    word: 'year',
  },
  {
    word: 'yes',
  },
  {
    word: 'zone',
  },
]
