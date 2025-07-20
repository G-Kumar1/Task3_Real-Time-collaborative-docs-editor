// src/components/CustomToolbar.jsx
import React from "react";

export const CustomToolbar = () => (
  <div id="toolbar" className="px-4 py-2 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
    
    {/* Font Family */}
    <select className="ql-font">
      <option value="arial">Arial</option>
      <option value="times-new-roman">Times New Roman</option>
      <option value="calibri">Calibri</option>
      <option value="comic-sans">Comic Sans</option>
    </select>

    {/* Font Size */}
    <select className="ql-size">
      <option value="8px">8</option>
      <option value="10px">10</option>
      <option value="12px">12</option>
      <option value="14px">14</option>
      <option value="16px">16</option>
      <option value="18px">18</option>
      <option value="20px">20</option>
      <option value="24px">24</option>
      <option value="28px">28</option>
    </select>

    {/* Others */}
    <button className="ql-bold" />
    <button className="ql-italic" />
    <button className="ql-underline" />
    <button className="ql-strike" />
    

    <select className="ql-align" />
    <select className="ql-color" />
    <select className="ql-background" />

    <button className="ql-list" value="ordered" />
    <button className="ql-list" value="bullet" />

    <button className="ql-link" />
    <button className="ql-image" />
    {/* <button className="q1-insertable" /> */}
    <button className="ql-clean" />
  </div>
);
