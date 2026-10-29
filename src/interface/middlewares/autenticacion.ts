
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DatosToken {
  id: number;
  email: string;
  role: "admin" | "user";
}

declare global {
  namespace Express {
    interface Request {
      usuario?: DatosToken;
    }
  }
}

export function autenticarToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const cabecera = req.headers.authorization;

  if (!cabecera || !cabecera.startsWith("Bearer ")) {
    res.status(401).json({
      mensaje: "Debes iniciar sesión para acceder a este recurso",
    });
    return;
  }

  const token = cabecera.slice(7);
  const secreto = process.env.JWT_SECRET;

  if (!secreto) {
    res.status(500).json({
      mensaje: "La configuración de autenticación no está completa",
    });
    return;
  }

  try {
    const datos = jwt.verify(token, secreto);

    if (
      typeof datos === "string" ||
      typeof datos !== "object" ||
      typeof datos.id !== "number" ||
      typeof datos.email !== "string" ||
      (datos.role !== "admin" && datos.role !== "user")
    ) {
      res.status(401).json({
        mensaje: "Token inválido",
      });
      return;
    }

    req.usuario = {
      id: datos.id,
      email: datos.email,
      role: datos.role,
    };

    next();
  } catch {
    res.status(401).json({
      mensaje: "Token inválido o expirado",
    });
  }
}

export function soloAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.usuario || req.usuario.role !== "admin") {
    res.status(403).json({
      mensaje: "No tienes permisos para realizar esta acción",
    });
    return;
  }

  next();
}
