import static org.forgerock.json.JsonValue.field
import static org.forgerock.json.JsonValue.json
import static org.forgerock.json.JsonValue.object

import org.forgerock.json.JsonValue

logger.error("TasosDebug::NormalizationScript::normalizedProfile::{}", normalizedProfile)

JsonValue identity = json(object(
        field("givenName", normalizedProfile.givenName),
        field("sn", normalizedProfile.familyName),
        field("uid", normalizedProfile.username),
  		field("userName", normalizedProfile.username),
        field("iplanet-am-user-alias-list", selectedIdp + '-' + normalizedProfile.username.asString())))

logger.error("TasosDebug::NormalizationScript::identity::{}", identity)
return identity