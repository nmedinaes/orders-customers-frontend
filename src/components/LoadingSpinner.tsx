"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = "Cargando..." }: LoadingSpinnerProps) {
  return (
    <div className="card card-app">
      <div className="card-body text-center py-5">
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          className="fs-1"
          style={{ color: "var(--app-primary)" }}
        />
        <p className="text-muted mt-3 mb-0">{message}</p>
      </div>
    </div>
  );
}
