function Content() {
    return (
        <div className="container-fluid"> 
            <div className="card shadow-sm mt-4 w-100"> 
                <div className="card-body">

                    <h5 className="fw-semibold mb-4">Customer List</h5>

                    <div className="table-responsive w-100"> 
                        <table className="table align-middle table-bordered">
                            <thead className="bg-light text-left">
                                <tr>
                                    <th>Id</th>
                                    <th>Assigned</th>
                                    <th>Name</th>
                                    <th>Priority</th>
                                    <th>Budget</th>
                                </tr>
                            </thead>

                            <tbody>

                                <tr>
                                    <td>1</td>
                                    <td>
                                        <div className="fw-bold">Sunil Joshi</div>
                                        <small className="text-muted">Web Designer</small>
                                    </td>
                                    <td>Elite Admin</td>
                                    <td><span className="badge bg-primary">Low</span></td>
                                    <td className="fw-bold">$3.9</td>
                                </tr>

                                <tr>
                                    <td>2</td>
                                    <td>
                                        <div className="fw-bold">Andrew McDownland</div>
                                        <small className="text-muted">Project Manager</small>
                                    </td>
                                    <td>Real Homes WP Theme</td>
                                    <td><span className="badge bg-secondary">Medium</span></td>
                                    <td className="fw-bold">$24.5k</td>
                                </tr>

                                <tr>
                                    <td>3</td>
                                    <td>
                                        <div className="fw-bold">Christopher Jamil</div>
                                        <small className="text-muted">Project Manager</small>
                                    </td>
                                    <td>MedicalPro WP Theme</td>
                                    <td><span className="badge bg-danger">High</span></td>
                                    <td className="fw-bold">$12.8k</td>
                                </tr>

                                <tr>
                                    <td>4</td>
                                    <td>
                                        <div className="fw-bold">Nirav Joshi</div>
                                        <small className="text-muted">Frontend Engineer</small>
                                    </td>
                                    <td>Hosting Press HTML</td>
                                    <td><span className="badge bg-success">Critical</span></td>
                                    <td className="fw-bold">$2.4k</td>
                                </tr>

                            </tbody>

                        </table>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Content
