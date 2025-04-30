# 1D VES Inversion Tool (Electron.js)

A desktop application for performing **1D Vertical Electrical Sounding (VES)** inversions using field-acquired resistivity data. Built with [Electron.js](https://www.electronjs.org/), this tool allows geophysicists and researchers to model subsurface structures based on the **Schlumberger array configuration**.

---

## ✨ Features

- Interactive GUI for entering AB/2 distances and resistivity values.
- Supports branch-based data entry for comparative analysis.
- Real-time model curve plotting and fit visualization.
- Inversion based on the **Levenberg-Marquardt algorithm**.
- Forward modeling using the **Lyman-Landisman filter coefficients**.
- Displays RMSE and predicted subsurface layer parameters.

---

## 📸 Screenshots

### 🧾 Data Entry Interface

Users enter data in branches for multiple measurements. The values are organized as AB/2 distances (current electrode spacing) and the corresponding measured resistivity.  
This feature allows both clarity and flexibility during input.

![image](https://github.com/user-attachments/assets/3d803fc8-0e7e-4738-91b4-cbb700a9f443)


---

### 📈 Inversion Plot

The program calculates a theoretical model curve using the entered data and plots it (in red) alongside the field data (black dots).
It also shows the final root-mean-square error (RMSE), which quantifies the difference between the observed and calculated data

![image](https://github.com/user-attachments/assets/40b9c9d0-c4e5-4e46-8365-06f218167136)


---

### 🧠 Model Parameters

After a successful inversion, the software presents the predicted resistivity and thickness of each subsurface layer.  


![image](https://github.com/user-attachments/assets/b3867c8d-b3f8-4f20-ac49-f469643fcd53)


---

## 🧠 About

Vertical Electrical Sounding is a geophysical method used to infer subsurface resistivity profiles. This software provides a convenient desktop-based interface for interpreting such data via 1D inversion techniques. While the results are theoretical approximations, they offer valuable insights for further geophysical or geological investigations.

>  *Currently, only Windows is supported and only the Schlumberger configuration is implemented.*

---

## 📌 Roadmap

- Allow data imports from Excel and DAT files 
- Add support for Wenner and Dipole-Dipole arrays 
- Export results to CSV/PDF  
- Cross-platform support (macOS)  
- Allow users to upload and run custom VES inversion MATLAB code.

---

## 🛠️ Built With

- [Electron.js](https://www.electronjs.org/)
- Custom 1D inversion engine using Levenberg-Marquardt
- Math.js
- D3.js

---

## 📄 License

MIT — free for educational and research use.








