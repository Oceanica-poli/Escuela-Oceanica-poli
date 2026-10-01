import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { inscribirseEnClase } from '../../../services/estudianteService';

const Inscribirse: React.FC = () => {
  const { idClase }                           = useParams<{ idClase: string }>();
  const navigate                              = useNavigate();
  const [preferenciaSexo, setPreferenciaSexo] = useState<string>('');
  const [error, setError]                     = useState('');
  const [exito, setExito]                     = useState(false);
  const [cargando, setCargando]               = useState(false);

  // El ID del estudiante viene del JWT en el backend —
  // NO se pide al usuario que lo ingrese manualmente.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idClase) return;

    setCargando(true);
    setError('');

    try {
      await inscribirseEnClase(
        Number(idClase),
        preferenciaSexo ? Number(preferenciaSexo) : undefined
      );
      setExito(true);
      setTimeout(() => navigate('/estudiante/mis-clases'), 1500);
    } catch (err: any) {
      setError(err.message || 'Error al inscribirse en la clase');
    } finally {
      setCargando(false);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: '480px' }}>
      <h2 className="mb-4">Inscribirse en Clase</h2>

      {exito && (
        <Alert variant="success">
          ¡Inscripción exitosa! Redirigiendo a Mis Clases…
        </Alert>
      )}

      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Campo de ID eliminado — el backend lo obtiene automáticamente del JWT */}

        <Form.Group className="mb-3">
          <Form.Label>Preferencia de sexo del profesor <span className="text-muted">(opcional)</span></Form.Label>
          <Form.Select
            value={preferenciaSexo}
            onChange={(e) => setPreferenciaSexo(e.target.value)}
          >
            <option value="">Sin preferencia</option>
            <option value="1">Masculino</option>
            <option value="2">Femenino</option>
            <option value="3">Otro</option>
          </Form.Select>
        </Form.Group>

        <div className="d-flex gap-2">
          <Button
            variant="primary"
            type="submit"
            disabled={cargando || exito}
          >
            {cargando ? 'Inscribiendo…' : 'Confirmar inscripción'}
          </Button>
          <Button
            variant="outline-secondary"
            type="button"
            onClick={() => navigate('/estudiante/clases-disponibles')}
            disabled={cargando}
          >
            Cancelar
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Inscribirse;