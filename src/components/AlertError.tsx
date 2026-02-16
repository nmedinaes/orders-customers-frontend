"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

interface AlertErrorProps {
  message: string;
  className?: string;
}

export function AlertError({ message, className = "" }: AlertErrorProps) {
  return (
    <div
      className={`alert alert-danger d-flex align-items-center rounded-3 ${className}`.trim()}
      role="alert"
    >
      <FontAwesomeIcon icon={faCircleExclamation} className="me-2" />
      {message}
    </div>
  );
}
