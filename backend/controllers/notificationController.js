const Loan = require('../models/Loan');
const User = require('../models/User');
const Asset = require('../models/Asset');
const nodemailer = require('nodemailer');

const notifyOverdueLoans = async (req, res) => {
  try {
    const overdueLoans = await Loan.findAll({
      where: {
        endDate: {
          [Op.lt]: new Date()
        },
        returned: false
      },
      include: [User, Asset]
    });

    overdueLoans.forEach(loan => {
      // Configurar transporte de e-mail
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: loan.User.email,
        subject: 'Empréstimo Vencido',
        text: `O empréstimo da ferramenta ${loan.Asset.name} venceu em ${loan.endDate}. Por favor, devolva o mais rápido possível.`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Erro ao enviar e-mail:', error);
        } else {
          console.log('E-mail enviado:', info.response);
        }
      });
    });

    res.json({ message: 'Notificações enviadas para empréstimos vencidos.' });
  } catch (error) {
    console.error('Erro ao enviar notificações:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { notifyOverdueLoans };
