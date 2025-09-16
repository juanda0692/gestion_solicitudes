import { useLocation, Link, useNavigate } from "react-router-dom";

export default function Confirm() {
    const { state } = useLocation() || {};
    const ok = !!state?.ok;
    const id = state?.solicitudId;
    const items = state?.items ?? 0;
    const navigate = useNavigate();

    return (
        <div className="w-full flex justify-center mt-16">
            <div className="w-[480px] rounded-xl shadow p-6 text-center bg-white">
                <h1 className={`text-3xl font-bold ${ok ? "text-green-600" : "text-red-600"}`}>
                    {ok ? "¡Éxito!" : "Hubo un problema"}
                </h1>
                <p className="mb-6">
                    {ok ? (id ? `Solicitud registrada (${items} ítems).` : "Solicitud registrada.")
                        : (state?.error || "No se pudo crear la solicitud")}
                </p>
                <div className="space-y-3">
                    <button
                        className="w-full rounded bg-cyan-600 text-white py-2"
                        onClick={() =>
                            navigate("/", {
                                replace: true,
                                state: {
                                    view: "pdv-actions",
                                    pdvId: state?.pdvId,
                                    pdvName: state?.pdvName || "",
                                },
                            })
                        }
                    >
                        Volver al Canal
                    </button>

                    {/* <button className="w-full rounded bg-gray-200 py-2" onClick={() => navigate("/")}>
                        Volver al inicio
                    </button> */}
                    <Link to="/" className="block w-full rounded bg-blue-800 text-white py-2">Inicio</Link>
                </div>
            </div>
        </div>
    );
}
