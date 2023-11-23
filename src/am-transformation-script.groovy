/*
 * Copyright 2020 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

/* Default Social Identity Provider Profile Transformation script to use as a template for new scripts */
import static org.forgerock.json.JsonValue.field
import static org.forgerock.json.JsonValue.json
import static org.forgerock.json.JsonValue.object

logger.error("TasosDebug::TransformationScript::rawProfile::{}", rawProfile)
return json(object(
       field("givenName", rawProfile.given_name),
       field("familyName", rawProfile.family_name),
       field("username", rawProfile.subname))) 