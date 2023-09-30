"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var UserController = require("controllers/user-controller");
var UIDMiddleware = require("middlewares/uid-middleware");
var router = (0, express_1.Router)();
// TODO: update for session/middleware
router.use(UIDMiddleware.getUserInfoJWT);
router.post('/', UserController.createUser);
router.get('/:id', UserController.getUserById);
router.get('/', UserController.getCurrentUser);
router.put('/', UserController.updateUser);
router.delete('/', UserController.deleteUser);
exports.default = router;
