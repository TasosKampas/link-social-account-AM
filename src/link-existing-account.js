/**
 * LinkExistingAccount
 * Search for the user in the user store based on ID token claim:
 * - If user exists, create the link (outcome = link)
 * - If doesn't exist, direct the tree to provision the account (outcome = no_user)
 */

/**
 * Node imports
 */

 var javaImports = JavaImporter(
    org.forgerock.openam.auth.node.api.Action
);

/**
 * Node config
 * nodeName - the name of the node
 * federationAttribute - the name of multi-valued linking attriibute (format is selectedIdp + uiid)
 * remote_uid - the Userinfo claim that maps to AM's uid attribute (that's it so we can check if user exists)
 */
 var nodeConfig = {
    nodeName: "LinkExistingAccount",
    federationAttribute: "iplanet-am-user-alias-list",
    remote_uid: "subname"

};

/**
 * Node outcomes
 */

 var nodeOutcomes = {
    LINK: "link",
    NO_USER: "no_user"
};

/**
 * Node Logger
 * @param message - The message to printed
 */

 var nodeLogger = {
    debug: function(message) {
        logger.message("***" + nodeConfig.nodeName + " " + message);
    },
    warning: function(message) {
        logger.warning("***" + nodeConfig.nodeName + " " + message);
    },
    error: function(message) {
        logger.error("***" + nodeConfig.nodeName + " " + message);
    }
};

/**
 * Node functions
 */

/**
 * Gathers existing links (if multiple IDPs are present) and push them into the incoming map attribute
 * @param username - set in shared state 
 * @param attributeName - attribute name that's a map including all links
 * @param multiValuedTerms - the map where are link are pushed
 * @returns multiValuedTerms - the updated map
 */

function gatherExistingLinks(username, attributeName, multiValued) {

    var userAttributeValueMap = idRepository.getAttribute(username, attributeName);
    if (userAttributeValueMap && userAttributeValueMap.toArray().length > 0) {
        userAttributeValueMap.toArray().forEach(function(userAttributeValue) {
            multiValued.push(userAttributeValue);
        });
    }
    return multiValued;
}

/**
 * Returns Action goTo 
 */

function getAction() {
    nodeLogger.error(sharedState);
    var userinfoSubClaim = sharedState.get("claims_set").get(nodeConfig.remote_uid); // Remote ID that maps hosted AM's uid
    if (idRepository.getAttribute(userinfoSubClaim, "uid").toArray()[0]) {
        nodeLogger.error("userExists. Link Account.");
        var newLink = sharedState.get("selectedIdp") + '-' + userinfoSubClaim;  // format is hardcoded in the Social node. Keepiing the same for so the Node can find the link.
        var aliasList = [];
        gatherExistingLinks(userinfoSubClaim, nodeConfig.federationAttribute, aliasList);
        aliasList.push(newLink);
        idRepository.setAttribute(userinfoSubClaim, nodeConfig.federationAttribute, aliasList);
        return javaImports.Action.goTo(nodeOutcomes.LINK).build();
    } else {
        nodeLogger.error("NoUserExists");
        return javaImports.Action.goTo(nodeOutcomes.NO_USER).build();
    }
}

/**
 * Main
 */

(function() {
    nodeLogger.error("Node starting")
    action = getAction();
})();