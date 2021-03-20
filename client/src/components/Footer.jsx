import React from "react";
import './Footer.css'

const Footer = () => {
    return (
        <footer className="footer" >
            <div className="footer-container" >
                <div>
                    <h3 style={{ fontWeight: "normal" }} >Copyright &copy; {new Date().getFullYear()}</h3>
                </div>
                <div >
                    <h3 style={{ fontWeight: "normal" }}>
                        Made by 
                        <span>
                            <a href="https://github.com/anshuman9999" 
                            style={{ color: "#2691d9" }} 
                            target="_blank"
                            > Anshuman Pandey</a>
                        </span>
                    </h3>
                </div>

            </div>
        </footer>
    );
};

export default Footer;