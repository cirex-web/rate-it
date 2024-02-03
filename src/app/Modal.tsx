import { useState } from "react";
import css from "./modal.module.css";

export const Modal = ({
  children,
  open,
  onClose,
  width,
}: {
  children: React.ReactNode;
  open: boolean;
  onClose: () => unknown;
  width?: string;
}) => {
  return (
    <div
      className={css.mainContainer}
      style={{ display: open ? "" : "none" }}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        onClose();
      }}
    >
      <div className={css.panel} style={{ width }}>
        {children}
      </div>
    </div>
  );
};
